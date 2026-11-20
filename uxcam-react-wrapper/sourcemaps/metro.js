/**
 * Metro serializer that stamps a debug ID into the JavaScript bundle and its
 * source map, so UXCam can match a crash to the exact map of the build that
 * produced it, including over-the-air bundles (the ID changes with the code).
 *
 * Usage, in the app's metro.config.js:
 *
 *   const {withUXCamDebugId} = require('react-native-ux-cam/sourcemaps/metro');
 *   module.exports = withUXCamDebugId(mergeConfig(getDefaultConfig(__dirname), config));
 *
 * The bundle gets a first line `globalThis.__UXCAM_DEBUG_ID__="<uuid>";`, which
 * the plugin reads into every crash report. The map gets a top-level
 * `debugId` field. The ID is also written to `<projectRoot>/.uxcam/debug-id-<platform>`
 * because Hermes builds compose a new map that does not keep extra fields.
 */
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PLACEHOLDER = '00000000-0000-0000-0000-000000000000';
const DEBUG_ID_GLOBAL = '__UXCAM_DEBUG_ID__';
const MODULE_PATH = '__uxcam_debug_id__';

function debugIdCode(debugId) {
    return `globalThis.${DEBUG_ID_GLOBAL}="${debugId}";`;
}

// Formats a SHA-256 hash as a UUID, so the ID has a fixed length and a
// familiar shape. Version and variant bits are set as for a name-based UUID.
function uuidFromHash(hash) {
    const hex = hash.slice(0, 32).split('');
    hex[12] = '5';
    hex[16] = ((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16);
    const value = hex.join('');
    return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20, 32)}`;
}

// The ID is the hash of the bundle with the placeholder in place, so the same
// code always gets the same ID. The placeholder and the ID have the same
// length, so replacing one with the other moves no source map position.
// The trailing sourceMappingURL comment is left out of the hash: it names the
// map file, which says nothing about the code.
function stampDebugId(code) {
    const hashed = code.replace(/\n\/\/# sourceMappingURL=[^\n]*\s*$/, '');
    const hash = crypto.createHash('sha256').update(hashed).digest('hex');
    const debugId = uuidFromHash(hash);
    return { debugId, code: code.replace(debugIdCode(PLACEHOLDER), debugIdCode(debugId)) };
}

function addDebugIdToMap(mapString, debugId) {
    const map = JSON.parse(mapString);
    map.debugId = debugId;
    return JSON.stringify(map);
}

function writeSidecar(projectRoot, platform, debugId) {
    if (!projectRoot) {
        return;
    }
    try {
        const directory = path.join(projectRoot, '.uxcam');
        fs.mkdirSync(directory, { recursive: true });
        fs.writeFileSync(path.join(directory, `debug-id-${platform || 'unknown'}`), `${debugId}\n`);
    } catch (_) {
        // The sidecar only helps the uploader with Hermes maps; never fail a build over it.
    }
}

function loadMetro(projectRoot) {
    const from = (request) => require(require.resolve(request, { paths: [projectRoot || process.cwd()] }));
    const countingSet = from('metro/src/lib/CountingSet');
    return {
        baseJSBundle: from('metro/src/DeltaBundler/Serializers/baseJSBundle'),
        bundleToString: from('metro/src/lib/bundleToString'),
        sourceMapString: from('metro/src/DeltaBundler/Serializers/sourceMapString').sourceMapString,
        countLines: from('metro/src/lib/countLines'),
        CountingSet: countingSet.default || countingSet,
    };
}

function createDebugIdModule(metro, code) {
    return {
        dependencies: new Map(),
        getSource: () => Buffer.from(code),
        inverseDependencies: new metro.CountingSet(),
        path: MODULE_PATH,
        output: [
            {
                type: 'js/script/virtual',
                data: { code, lineCount: metro.countLines(code), map: [] },
            },
        ],
    };
}

// Same order Metro uses for its own source map (Server._getSortedModules).
function sortedModules(graph, options) {
    return [...graph.dependencies.values()].sort(
        (a, b) => options.createModuleId(a.path) - options.createModuleId(b.path),
    );
}

function createUXCamSerializer() {
    return function uxcamSerializer(entryPoint, preModules, graph, options) {
        const metro = loadMetro(options.projectRoot);
        const debugIdModule = createDebugIdModule(metro, debugIdCode(PLACEHOLDER));
        const modulesBefore = [debugIdModule, ...preModules];

        const bundle = metro.bundleToString(metro.baseJSBundle(entryPoint, modulesBefore, graph, options));
        const { debugId, code } = stampDebugId(bundle.code);

        const map = metro.sourceMapString([...modulesBefore, ...sortedModules(graph, options)], {
            excludeSource: options.excludeSource,
            processModuleFilter: options.processModuleFilter,
            shouldAddToIgnoreList: options.shouldAddToIgnoreList,
            getSourceUrl: options.getSourceUrl,
        });

        writeSidecar(options.projectRoot, graph.transformOptions && graph.transformOptions.platform, debugId);
        return { code, map: addDebugIdToMap(map, debugId) };
    };
}

function withUXCamDebugId(config) {
    const serializer = (config && config.serializer) || {};
    if (serializer.customSerializer) {
        // Two serializers cannot both own the bundle (for example Sentry's).
        console.warn('[UXCam] metro.config.js already sets serializer.customSerializer; UXCam debug IDs are not added.');
        return config;
    }
    return {
        ...config,
        serializer: { ...serializer, customSerializer: createUXCamSerializer() },
    };
}

module.exports = {
    withUXCamDebugId,
    createUXCamSerializer,
    // Exported for tests and for the upload script.
    stampDebugId,
    uuidFromHash,
    debugIdCode,
    PLACEHOLDER,
    DEBUG_ID_GLOBAL,
};
