#!/usr/bin/env node
/*
 * Checks a JavaScript crash recorded by the UXCam SDK, before the dashboard
 * supports the new crash keys.
 *
 * Input: the SDK's integration-log line ("[UXCam] UXCAM_JS_CRASH session=… {json}")
 * or the bare JSON, from a file argument or stdin. With integration logging on,
 * the SDK prints that line on the launch after the crash.
 *
 *   pbpaste | node verify-js-crash.js
 *   node verify-js-crash.js crash.log --map main.jsbundle.map
 *
 * --map symbolicates the JavaScript frames with metro-symbolicate, resolved
 * from the current directory, so run it from the app folder.
 */
'use strict';

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
    const args = { input: null, map: null };
    for (let i = 0; i < argv.length; i++) {
        if (argv[i] === '--map') {
            args.map = argv[++i];
        } else if (argv[i] === '--help' || argv[i] === '-h') {
            args.help = true;
        } else {
            args.input = argv[i];
        }
    }
    return args;
}

// Returns every crash JSON found in the text (log lines or bare JSON).
function extractCrashes(text) {
    const crashes = [];
    const marker = 'UXCAM_JS_CRASH';
    for (const line of text.split('\n')) {
        const at = line.indexOf(marker);
        if (at === -1) continue;
        const start = line.indexOf('{', at);
        if (start === -1) continue;
        crashes.push(JSON.parse(line.slice(start)));
    }
    if (crashes.length === 0 && text.trim().startsWith('{')) {
        crashes.push(JSON.parse(text));
    }
    return crashes;
}

function checkContract(crash) {
    const results = [];
    const check = (ok, label) => results.push({ ok: Boolean(ok), label });
    const exception = Array.isArray(crash.crashExceptions) ? crash.crashExceptions[0] : null;
    const js = crash.js || {};
    const native = crash.nativeException || {};
    const callStack = exception && Array.isArray(exception.UnhandledExceptionCallStack)
        ? exception.UnhandledExceptionCallStack : [];

    check(crash.exceptionType === 'javascript', 'exceptionType is "javascript"');
    check(crash.jsSource === 'plugin' || crash.jsSource === 'parsed', `jsSource is "plugin" or "parsed" (got ${JSON.stringify(crash.jsSource)})`);
    check(exception && typeof exception.UnhandledExceptionName === 'string', 'crashExceptions[0] has the JS error name');
    check(exception && typeof exception.UnhandledExceptionReason === 'string', 'crashExceptions[0] has the JS message');
    check(exception && exception.UnhandledExceptionName === js.name, 'crashExceptions[0] name matches js.name');
    check(typeof js.name === 'string' && typeof js.message === 'string', 'js has name and message');
    check(Array.isArray(js.frames) && js.frames.length <= 100, 'js.frames is an array of at most 100');
    check((js.frames || []).every((f) => typeof f.fn === 'string' && Number.isFinite(f.line) && Number.isFinite(f.col)),
        'every frame has fn, line and col');
    check(callStack.length === (js.frames || []).length, 'call stack has one entry per JS frame');
    check(callStack.length === 0 || crash['crashedThread-TopOfStack'] === callStack[0], 'top of stack is the first JS frame');
    const nativeName = String(native.UnhandledExceptionName || '');
    check(nativeName.startsWith('RCTFatalException') || nativeName.includes('JSError'),
        'nativeException keeps React Native\'s exception');
    return results;
}

function loadSymbolicator(mapPath) {
    const resolveFrom = (name) => require.resolve(name, { paths: [process.cwd()] });
    const Symbolication = require(resolveFrom('metro-symbolicate/src/Symbolication'));
    const { SourceMapConsumer } = require(resolveFrom('source-map'));
    const content = fs.readFileSync(mapPath, 'utf8');
    const map = JSON.parse(content);
    const context = Symbolication.createContext(SourceMapConsumer, content, {});
    return { context, debugId: map.debugId || map.debug_id || null };
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
        console.log('usage: node verify-js-crash.js [crash.log] [--map bundle.map]');
        return 0;
    }
    const text = args.input ? fs.readFileSync(args.input, 'utf8') : fs.readFileSync(0, 'utf8');
    let crashes;
    try {
        crashes = extractCrashes(text);
    } catch (error) {
        console.error(`Could not parse the crash JSON: ${error.message}`);
        return 2;
    }
    if (crashes.length === 0) {
        console.error('No UXCAM_JS_CRASH line found. Turn on enableIntegrationLogging and relaunch after the crash.');
        return 2;
    }
    const symbolicator = args.map ? loadSymbolicator(path.resolve(args.map)) : null;

    let failures = 0;
    crashes.forEach((crash, index) => {
        const js = crash.js || {};
        console.log(`\nCrash ${index + 1}: ${js.name}: ${js.message}  (jsSource: ${crash.jsSource})`);
        for (const result of checkContract(crash)) {
            console.log(`  ${result.ok ? 'PASS' : 'FAIL'}  ${result.label}`);
            if (!result.ok) failures += 1;
        }
        if (symbolicator) {
            if (js.debugId || symbolicator.debugId) {
                const same = js.debugId === symbolicator.debugId;
                console.log(`  ${same ? 'PASS' : 'FAIL'}  debug ID matches the map (crash ${js.debugId}, map ${symbolicator.debugId})`);
                if (!same) failures += 1;
            } else {
                console.log('  NOTE  no debug IDs yet (phase 3); make sure this map is from the same build');
            }
            console.log('  Symbolicated frames:');
            for (const frame of js.frames || []) {
                const original = symbolicator.context.getOriginalPositionFor(frame.line, frame.col, null);
                const where = original.source ? `${original.source}:${original.line}:${original.column}` : '(no mapping)';
                console.log(`    ${frame.fn}@${frame.line}:${frame.col}  ->  ${where}  ${original.name || ''}`);
            }
        }
    });
    console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
    return failures === 0 ? 0 : 1;
}

if (require.main === module) {
    process.exitCode = main();
}

module.exports = { extractCrashes, checkContract };
