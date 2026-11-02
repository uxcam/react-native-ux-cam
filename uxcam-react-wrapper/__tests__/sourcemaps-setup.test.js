const {
    decodePbxString,
    encodePbxString,
    wrapBundleScript,
    patchXcodeProject,
    setShellExport,
    setProperty,
    patchAppBuildGradle,
    patchMetroConfig,
    patchGitignore,
} = require('../sourcemaps/setup');

const UXCAM_XCODE = '../node_modules/react-native-ux-cam/sourcemaps/uxcam-xcode.sh';
const MODERN_PHASE =
    'set -e\n\nWITH_ENVIRONMENT="../node_modules/react-native/scripts/xcode/with-environment.sh"\n' +
    'REACT_NATIVE_XCODE="../node_modules/react-native/scripts/react-native-xcode.sh"\n\n/bin/sh -c "$WITH_ENVIRONMENT $REACT_NATIVE_XCODE"\n';
const LEGACY_PHASE = 'export NODE_BINARY=node\n../node_modules/react-native/scripts/react-native-xcode.sh';

function pbxproj(script, sandboxing = 'NO') {
    return [
        '\t\t00DD1BFF1BD5951E006B06BC /* Bundle React Native code and images */ = {',
        '\t\t\tisa = PBXShellScriptBuildPhase;',
        '\t\t\tname = "Bundle React Native code and images";',
        `\t\t\tshellScript = ${encodePbxString(script)};`,
        '\t\t};',
        '\t\t11111111 /* [CP] Check Pods Manifest.lock */ = {',
        '\t\t\tisa = PBXShellScriptBuildPhase;',
        '\t\t\tname = "[CP] Check Pods Manifest.lock";',
        '\t\t\tshellScript = "diff \\"${PODS_PODFILE_DIR_PATH}/Podfile.lock\\"\\n";',
        '\t\t};',
        `\t\t\t\tENABLE_USER_SCRIPT_SANDBOXING = ${sandboxing};`,
    ].join('\n');
}

describe('Xcode bundle phase', () => {
    test('round-trips pbxproj strings', () => {
        const script = 'a "quoted" \\ back\tslash\nnext';
        expect(decodePbxString(encodePbxString(script))).toBe(script);
    });

    test('runs the with-environment form through uxcam-xcode.sh', () => {
        const wrapped = wrapBundleScript(MODERN_PHASE, UXCAM_XCODE);
        expect(wrapped).toContain(`UXCAM_XCODE="${UXCAM_XCODE}"\n`);
        expect(wrapped).toContain('/bin/sh -c "$WITH_ENVIRONMENT \\"/bin/bash $UXCAM_XCODE $REACT_NATIVE_XCODE\\""\n');
        expect(wrapped.endsWith('\n')).toBe(true);
    });

    test('runs a direct react-native-xcode.sh call through uxcam-xcode.sh', () => {
        expect(wrapBundleScript(LEGACY_PHASE, UXCAM_XCODE)).toBe(
            `export NODE_BINARY=node\nUXCAM_XCODE="${UXCAM_XCODE}"\n/bin/bash "$UXCAM_XCODE" ../node_modules/react-native/scripts/react-native-xcode.sh`,
        );
    });

    test('leaves a wrapped phase alone and reports an unknown one', () => {
        const wrapped = wrapBundleScript(MODERN_PHASE, UXCAM_XCODE);
        expect(wrapBundleScript(wrapped, UXCAM_XCODE)).toBe(wrapped);
        expect(wrapBundleScript('npx expo export:embed', UXCAM_XCODE)).toBeNull();
    });

    test('patches only the bundle phase, once, and turns sandboxing off', () => {
        const first = patchXcodeProject(pbxproj(MODERN_PHASE, 'YES'), UXCAM_XCODE);
        expect(first).toMatchObject({ phases: 1, unrecognized: 0, sandboxed: 1 });
        expect(first.text).toContain('uxcam-xcode.sh');
        expect(first.text).toContain('ENABLE_USER_SCRIPT_SANDBOXING = NO;');
        expect(first.text).toContain('shellScript = "diff \\"${PODS_PODFILE_DIR_PATH}/Podfile.lock\\"\\n";');
        expect(patchXcodeProject(first.text, UXCAM_XCODE).text).toBe(first.text);
    });
});

describe('settings files', () => {
    test('adds, then replaces, the app key in .xcode.env', () => {
        const added = setShellExport('export NODE_BINARY=$(command -v node)\n', 'UXCAM_APP_KEY', 'one', 'UXCam');
        expect(added).toBe('export NODE_BINARY=$(command -v node)\n\n# UXCam\nexport UXCAM_APP_KEY=one\n');
        expect(setShellExport(added, 'UXCAM_APP_KEY', 'two', 'UXCam')).toBe(added.replace('=one', '=two'));
        expect(setShellExport('UXCAM_APP_KEY=old\n', 'UXCAM_APP_KEY', 'new', 'UXCam')).toBe('export UXCAM_APP_KEY=new\n');
    });

    test('adds, then replaces, uxcam.appKey in gradle.properties', () => {
        const added = setProperty('hermesEnabled=true', 'uxcam.appKey', 'one', 'UXCam');
        expect(added).toBe('hermesEnabled=true\n\n# UXCam\nuxcam.appKey=one\n');
        expect(setProperty(added, 'uxcam.appKey', 'two', 'UXCam')).toBe(added.replace('=one', '=two'));
    });

    test('applies uxcam.gradle after the React Native plugin, once', () => {
        const gradle = 'apply plugin: "com.android.application"\napply plugin: "com.facebook.react"\n\nreact {\n}\n';
        const patched = patchAppBuildGradle(gradle, '../../node_modules/react-native-ux-cam/sourcemaps/uxcam.gradle');
        expect(patched).toBe(
            'apply plugin: "com.android.application"\napply plugin: "com.facebook.react"\n' +
                'apply from: "../../node_modules/react-native-ux-cam/sourcemaps/uxcam.gradle"\n\nreact {\n}\n',
        );
        expect(patchAppBuildGradle(patched, 'x')).toBe(patched);
        expect(patchAppBuildGradle('plugins { id("com.facebook.react") }', 'x')).toBeNull();
    });

    test('ignores .uxcam/ once', () => {
        const patched = patchGitignore('node_modules/\n');
        expect(patched).toContain('\n.uxcam/\n');
        expect(patchGitignore(patched)).toBe(patched);
    });
});

describe('Metro config', () => {
    const config =
        "const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');\n\n" +
        'const config = {};\n\nmodule.exports = mergeConfig(getDefaultConfig(__dirname), config);\n';

    test('wraps the exported config and requires the serializer', () => {
        const patched = patchMetroConfig(config);
        expect(patched).toBe(
            "const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');\n" +
                "const {withUXCamDebugId} = require('react-native-ux-cam/sourcemaps/metro');\n\n" +
                'const config = {};\n\nmodule.exports = withUXCamDebugId(mergeConfig(getDefaultConfig(__dirname), config));\n',
        );
        expect(patchMetroConfig(patched)).toBe(patched);
    });

    test('wraps a multi-line export', () => {
        const patched = patchMetroConfig('module.exports = {\n  resolver: {},\n};\n');
        expect(patched).toBe("const {withUXCamDebugId} = require('react-native-ux-cam/sourcemaps/metro');\nmodule.exports = withUXCamDebugId({\n  resolver: {},\n});\n");
    });

    test('reports a config that does not end with module.exports', () => {
        expect(patchMetroConfig('export default config;\n')).toBeNull();
        expect(patchMetroConfig('module.exports = config;\nconsole.log(1);\n')).toBeNull();
    });
});
