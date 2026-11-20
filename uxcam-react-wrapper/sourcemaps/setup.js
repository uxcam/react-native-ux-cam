#!/usr/bin/env node
/**
 * Sets up a React Native app to upload its source maps to UXCam, so JavaScript
 * crashes are symbolicated. Run it from the app's root folder:
 *
 *   npx uxcam-sourcemaps-setup [--app-key <key>] [--project-root <dir>] [--dry-run]
 *
 * Asks for the UXCam app key when --app-key is not given, then:
 *   metro.config.js            wraps the config in withUXCamDebugId
 *   ios/.xcode.env             export UXCAM_APP_KEY=<key>
 *   ios/<App>.xcodeproj        runs "Bundle React Native code and images" through
 *                              sourcemaps/uxcam-xcode.sh; turns user script sandboxing off
 *   android/gradle.properties  uxcam.appKey=<key>
 *   android/app/build.gradle   applies sourcemaps/uxcam.gradle
 *   .gitignore                 ignores .uxcam/, where Metro keeps the last debug ID
 *
 * Running it again changes only what is missing, and a new key replaces the old one.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const APP_KEY = /^[A-Za-z0-9_-]+$/;
const PACKAGE = 'react-native-ux-cam';
const BUNDLE_PHASE = /^\s*name = "?Bundle React Native code and images"?;/im;
const METRO_REQUIRE = `const {withUXCamDebugId} = require('${PACKAGE}/sourcemaps/metro');`;

function parseArgs(argv) {
    const args = { dryRun: false };
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--app-key') args.appKey = argv[++i];
        else if (arg === '--project-root') args.projectRoot = argv[++i];
        else if (arg === '--dry-run') args.dryRun = true;
        else if (arg === '--help' || arg === '-h') args.help = true;
        else throw new Error(`Unknown option: ${arg}`);
    }
    args.projectRoot = path.resolve(args.projectRoot || process.cwd());
    return args;
}

// Strings in project.pbxproj are quoted with backslash escapes.
function decodePbxString(quoted) {
    return quoted.slice(1, -1).replace(/\\(.)/g, (_, c) => ({ n: '\n', t: '\t' }[c] || c));
}

function encodePbxString(text) {
    return `"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\t/g, '\\t')}"`;
}

// Puts uxcam-xcode.sh in front of React Native's bundling script. Returns null
// when the script has a shape this does not recognize.
function wrapBundleScript(script, uxcamXcode) {
    if (script.includes('uxcam-xcode.sh')) return script;
    const definition = `UXCAM_XCODE="${uxcamXcode}"`;
    // React Native 0.69 and later: /bin/sh -c "$WITH_ENVIRONMENT $REACT_NATIVE_XCODE"
    const withEnvironment = /^([ \t]*)\/bin\/sh -c "\$WITH_ENVIRONMENT (?:\\")?\$REACT_NATIVE_XCODE(?:\\")?"[ \t]*$/m;
    if (withEnvironment.test(script)) {
        return script.replace(withEnvironment, (_, indent) =>
            `${indent}${definition}\n${indent}/bin/sh -c "$WITH_ENVIRONMENT \\"/bin/bash $UXCAM_XCODE $REACT_NATIVE_XCODE\\""`);
    }
    // Older projects call react-native-xcode.sh directly
    const direct = /^([ \t]*)((?:\S*\/)?react-native-xcode\.sh)[ \t]*$/m;
    if (direct.test(script)) {
        return script.replace(direct, (_, indent, rnScript) => `${indent}${definition}\n${indent}/bin/bash "$UXCAM_XCODE" ${rnScript}`);
    }
    return null;
}

function patchXcodeProject(pbxproj, uxcamXcode) {
    let phases = 0;
    let unrecognized = 0;
    let text = pbxproj.replace(/\{\s*isa = PBXShellScriptBuildPhase;[\s\S]*?\n\s*\};/g, (block) => {
        if (!BUNDLE_PHASE.test(block)) return block;
        phases++;
        return block.replace(/(shellScript = )("(?:[^"\\]|\\.)*")/, (match, prefix, quoted) => {
            const wrapped = wrapBundleScript(decodePbxString(quoted), uxcamXcode);
            if (wrapped === null) {
                unrecognized++;
                return match;
            }
            return prefix + encodePbxString(wrapped);
        });
    });
    // Like the dSYM upload, the build phase has to reach node_modules and the network.
    const sandboxed = (text.match(/ENABLE_USER_SCRIPT_SANDBOXING = YES;/g) || []).length;
    text = text.replace(/ENABLE_USER_SCRIPT_SANDBOXING = YES;/g, 'ENABLE_USER_SCRIPT_SANDBOXING = NO;');
    return { text, phases, unrecognized, sandboxed };
}

// Sets `export NAME=value` in a shell file such as ios/.xcode.env.
function setShellExport(text, name, value, comment) {
    const line = `export ${name}=${value}`;
    const existing = new RegExp(`^\\s*(?:export\\s+)?${name}=.*$`, 'm');
    if (existing.test(text)) return text.replace(existing, line);
    return `${text}${text && !text.endsWith('\n') ? '\n' : ''}\n# ${comment}\n${line}\n`;
}

// Sets `name=value` in a .properties file such as android/gradle.properties.
function setProperty(text, name, value, comment) {
    const line = `${name}=${value}`;
    const existing = new RegExp(`^\\s*${name.replace(/\./g, '\\.')}\\s*=.*$`, 'm');
    if (existing.test(text)) return text.replace(existing, line);
    return `${text}${text && !text.endsWith('\n') ? '\n' : ''}\n# ${comment}\n${line}\n`;
}

// Applies uxcam.gradle right after the React Native Gradle plugin. Returns null
// when the plugin line is not there.
function patchAppBuildGradle(text, uxcamGradle) {
    if (text.includes('uxcam.gradle')) return text;
    const reactPlugin = /^([ \t]*apply plugin:[ \t]*["']com\.facebook\.react["'][ \t]*)$/m;
    if (!reactPlugin.test(text)) return null;
    return text.replace(reactPlugin, `$1\napply from: "${uxcamGradle}"`);
}

// Wraps the exported config: module.exports = withUXCamDebugId(<config>).
// Returns null when the file does not end with a module.exports assignment.
function patchMetroConfig(text) {
    if (text.includes('withUXCamDebugId')) return text;
    // The last module.exports, running to the end of the file
    const start = text.search(/^module\.exports\s*=(?![\s\S]*^module\.exports\s*=)/m);
    if (start === -1) return null;
    const match = /^module\.exports\s*=\s*([\s\S]+?);?\s*$/.exec(text.slice(start));
    // Code after the export (another statement) would be wrapped with it
    if (!match || /;\s*\S/.test(match[1])) return null;
    const wrapped = text.slice(0, start) + `module.exports = withUXCamDebugId(${match[1].trim()});\n`;
    const requires = [...wrapped.matchAll(/^(?:const|let|var)\s.*\brequire\(.*$/gm)];
    if (requires.length === 0) return `${METRO_REQUIRE}\n${wrapped}`;
    const last = requires[requires.length - 1];
    const at = last.index + last[0].length;
    return `${wrapped.slice(0, at)}\n${METRO_REQUIRE}${wrapped.slice(at)}`;
}

function patchGitignore(text) {
    if (/^\/?\.uxcam\/?\s*$/m.test(text)) return text;
    return `${text}${text && !text.endsWith('\n') ? '\n' : ''}\n# UXCam: debug ID of the last bundle (react-native-ux-cam)\n.uxcam/\n`;
}

// Where the app reaches this package, so build files can use a relative path
// as React Native's own build phase does.
function packageDir(projectRoot) {
    try {
        return path.dirname(require.resolve(`${PACKAGE}/package.json`, { paths: [projectRoot] }));
    } catch (_) {
        return path.dirname(__dirname);
    }
}

function relativePath(fromDir, file) {
    const relative = path.relative(fromDir, file).split(path.sep).join('/');
    return relative.startsWith('.') ? relative : `./${relative}`;
}

async function askAppKey() {
    if (!process.stdin.isTTY) throw new Error('Pass --app-key <key>; there is no terminal to ask for it.');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    try {
        return (await new Promise((resolve) => rl.question('UXCam app key: ', resolve))).trim();
    } finally {
        rl.close();
    }
}

function main(args) {
    const root = args.projectRoot;
    const pkgDir = packageDir(root);
    const results = [];
    const manual = [];

    function update(file, patch, onUnchanged) {
        const exists = fs.existsSync(file);
        const before = exists ? fs.readFileSync(file, 'utf8') : '';
        const after = patch(before, exists);
        const name = path.relative(root, file);
        if (after === null) return false;
        if (after === before) {
            results.push(`  ${name}: ${onUnchanged || 'already set up'}`);
        } else {
            if (!args.dryRun) fs.writeFileSync(file, after);
            const change = exists ? 'update' : 'create';
            results.push(`  ${name}: ${args.dryRun ? `would ${change}` : `${change}d`}`);
        }
        return true;
    }

    // Metro: stamp a debug ID into every bundle
    const metro = ['metro.config.js', 'metro.config.cjs'].map((f) => path.join(root, f)).find((f) => fs.existsSync(f));
    if (!metro || !update(metro, (text) => patchMetroConfig(text))) {
        manual.push(`Wrap the Metro config: ${METRO_REQUIRE}\n     module.exports = withUXCamDebugId(<your config>);`);
    }

    // iOS
    const iosDir = path.join(root, 'ios');
    if (fs.existsSync(iosDir)) {
        update(path.join(iosDir, '.xcode.env'), (text) =>
            setShellExport(text, 'UXCAM_APP_KEY', args.appKey, 'UXCam app key, for source map uploads (react-native-ux-cam)'));
        const uxcamXcode = relativePath(iosDir, path.join(pkgDir, 'sourcemaps', 'uxcam-xcode.sh'));
        const projects = fs.readdirSync(iosDir).filter((f) => f.endsWith('.xcodeproj') && f !== 'Pods.xcodeproj');
        for (const project of projects) {
            const file = path.join(iosDir, project, 'project.pbxproj');
            if (!fs.existsSync(file)) continue;
            let outcome;
            update(file, (text) => {
                outcome = patchXcodeProject(text, uxcamXcode);
                return outcome.text;
            });
            if (outcome.phases === 0 || outcome.unrecognized > 0) {
                manual.push(`In ${project}, run the "Bundle React Native code and images" phase through uxcam-xcode.sh:\n` +
                    `     /bin/sh -c "$WITH_ENVIRONMENT \\"/bin/bash ${uxcamXcode} $REACT_NATIVE_XCODE\\""`);
            }
            if (outcome.sandboxed > 0) results.push(`    turned ENABLE_USER_SCRIPT_SANDBOXING off (${outcome.sandboxed} build configurations)`);
        }
    }

    // Android
    const androidDir = path.join(root, 'android');
    if (fs.existsSync(androidDir)) {
        update(path.join(androidDir, 'gradle.properties'), (text) =>
            setProperty(text, 'uxcam.appKey', args.appKey, 'UXCam app key, for source map uploads (react-native-ux-cam)'));
        const appDir = path.join(androidDir, 'app');
        const uxcamGradle = relativePath(appDir, path.join(pkgDir, 'sourcemaps', 'uxcam.gradle'));
        const gradle = path.join(appDir, 'build.gradle');
        if (!fs.existsSync(gradle) || !update(gradle, (text) => patchAppBuildGradle(text, uxcamGradle))) {
            manual.push(`In android/app/build.gradle, after the React Native plugin: apply from: "${uxcamGradle}"`);
        }
    }

    update(path.join(root, '.gitignore'), (text, exists) => (exists ? patchGitignore(text) : null));

    console.log(`UXCam source map upload${args.dryRun ? ' (dry run, nothing written)' : ''}:`);
    console.log(results.join('\n'));
    if (manual.length > 0) {
        console.log('\nDo by hand, the file did not have the expected shape:');
        manual.forEach((step) => console.log(`  - ${step}`));
    }
    console.log('\nRelease builds now upload their source map to UXCam (iOS: Release builds and archives; Android: release variants).');
}

if (require.main === module) {
    (async () => {
        const args = parseArgs(process.argv.slice(2));
        if (args.help) {
            console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]);
            return;
        }
        args.appKey = args.appKey || (await askAppKey());
        if (!APP_KEY.test(args.appKey || '')) throw new Error('The app key can contain only letters, digits, - and _.');
        main(args);
    })().catch((error) => {
        console.error(`[UXCam] ${error.message}`);
        process.exitCode = 1;
    });
}

module.exports = {
    parseArgs,
    decodePbxString,
    encodePbxString,
    wrapBundleScript,
    patchXcodeProject,
    setShellExport,
    setProperty,
    patchAppBuildGradle,
    patchMetroConfig,
    patchGitignore,
};
