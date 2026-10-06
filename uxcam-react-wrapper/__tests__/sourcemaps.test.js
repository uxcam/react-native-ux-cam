const fs = require('fs');
const os = require('os');
const path = require('path');

const { stampDebugId, uuidFromHash, debugIdCode, PLACEHOLDER, withUXCamDebugId } = require('../sourcemaps/metro');
const { parseArgs, resolveDebugId, sanitizeMap, uploadFileName, uploadKey } = require('../sourcemaps/upload-sourcemap');

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('metro serializer helpers', () => {
    const bundle = `${debugIdCode(PLACEHOLDER)}\nvar a=1;\n__r(0);\n//# sourceMappingURL=main.jsbundle.map`;

    test('stamps a UUID-shaped ID without changing the bundle length', () => {
        const { debugId, code } = stampDebugId(bundle);
        expect(debugId).toMatch(UUID);
        expect(code.startsWith(debugIdCode(debugId))).toBe(true);
        expect(code).toHaveLength(bundle.length);
    });

    test('gives the same code the same ID, whatever the map file is called', () => {
        const renamed = bundle.replace('main.jsbundle.map', 'other.map');
        expect(stampDebugId(renamed).debugId).toBe(stampDebugId(bundle).debugId);
        expect(stampDebugId(bundle.replace('a=1', 'a=2')).debugId).not.toBe(stampDebugId(bundle).debugId);
    });

    test('formats hashes as name-based UUIDs', () => {
        expect(uuidFromHash('f'.repeat(64))).toMatch(UUID);
    });

    test('leaves an existing custom serializer alone', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const existing = () => 'x';
        const config = { serializer: { customSerializer: existing } };
        expect(withUXCamDebugId(config).serializer.customSerializer).toBe(existing);
        expect(typeof withUXCamDebugId({}).serializer.customSerializer).toBe('function');
        warn.mockRestore();
    });
});

describe('upload script helpers', () => {
    const id = '45f62e43-303c-58ac-b833-77ac59060b43';
    let dir;

    beforeEach(() => {
        dir = fs.mkdtempSync(path.join(os.tmpdir(), 'uxcam-test-'));
    });

    afterEach(() => {
        fs.rmSync(dir, { recursive: true, force: true });
    });

    test('finds the debug ID in the option, map, sidecar, then bundle', () => {
        const base = { projectRoot: dir, platform: 'ios', map: {} };
        expect(resolveDebugId({ ...base, debugId: id })).toBe(id);
        expect(resolveDebugId({ ...base, map: { debugId: id } })).toBe(id);

        fs.mkdirSync(path.join(dir, '.uxcam'));
        fs.writeFileSync(path.join(dir, '.uxcam', 'debug-id-ios'), `${id}\n`);
        expect(resolveDebugId(base)).toBe(id);
        fs.rmSync(path.join(dir, '.uxcam'), { recursive: true });

        const bundlePath = path.join(dir, 'main.jsbundle');
        fs.writeFileSync(bundlePath, `${debugIdCode(id)}\nvar a;`);
        expect(resolveDebugId({ ...base, bundlePath })).toBe(id);

        expect(resolveDebugId({ ...base, debugId: 'not-an-id' })).toBeNull();
    });

    test('strips source code and build-machine paths, keeps RN function data', () => {
        const map = {
            sources: [`${dir}/src/App.tsx`, '/ci/build/node_modules/react-native/index.js', '__prelude__'],
            sourcesContent: ['secret source', 'x', null],
            x_facebook_sources: [[{ names: ['<global>'], mappings: 'AAA' }]],
            mappings: 'AAAA',
        };
        const result = sanitizeMap(map, { projectRoot: dir, keepSources: false });
        expect(result.sources).toEqual(['src/App.tsx', 'node_modules/react-native/index.js', '__prelude__']);
        expect(result.sourcesContent).toBeUndefined();
        expect(result.x_facebook_sources).toEqual(map.x_facebook_sources);
        expect(sanitizeMap(map, { projectRoot: dir, keepSources: true }).sourcesContent).toEqual(map.sourcesContent);
    });

    test('parses options and names the upload by debug ID and platform', () => {
        const args = parseArgs(['--platform', 'android', '--map', 'a.map', '--debug-id', id, '--dry-run']);
        expect(args).toMatchObject({ platform: 'android', map: 'a.map', debugId: id, dryRun: true, keepSources: false });
        expect(uploadFileName(id, 'android')).toBe(`${id}.android.jsbundle.map`);
        // /v4/dsym returns the "<orgId>/<appId>/" prefix the dSYMs use; maps go in its jsbundle/ folder
        expect(uploadKey('11/22/', `${id}.android.jsbundle.map.zip`)).toBe(`11/22/jsbundle/${id}.android.jsbundle.map.zip`);
        expect(() => parseArgs(['--nope'])).toThrow('Unknown option');
    });
});
