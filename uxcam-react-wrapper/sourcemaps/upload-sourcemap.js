#!/usr/bin/env node
/**
 * Uploads a React Native source map to UXCam through the dSYM upload: ask the
 * UXCam API (/v4/dsym) for a presigned S3 upload, then POST the zipped map to S3
 * under <prefix>jsbundle/<debugId>.<platform>.jsbundle.map.zip, next to the
 * app's dSYMs. The backend looks the map up by the debug ID a crash carries.
 *
 *   uxcam-sourcemaps --app-key <key> --platform ios --map main.jsbundle.map [--bundle main.jsbundle]
 *
 * Options:
 *   --app-key <key>       UXCam app key (or UXCAM_APP_KEY)
 *   --platform <name>     ios or android
 *   --map <path>          the final source map (Hermes: the composed map)
 *   --bundle <path>       the shipped bundle, used to find the debug ID of a JSC build
 *   --packager-map <path> Metro's own map, which keeps the debug ID that Hermes map
 *                         composition drops (Android: intermediates/sourcemaps/react/<variant>/
 *                         index.android.bundle.packager.map; found automatically there)
 *   --debug-id <id>       use this debug ID instead of finding it
 *   --project-root <dir>  where .uxcam/debug-id-<platform> is (default: current directory)
 *   --keep-sources        upload the embedded source code too (default: strip it)
 *   --base-url <url>      API host (or UXCAM_BASE_URL; default https://verify.uxcam.com)
 *   --dry-run             prepare the zip and print the request, but upload nothing
 *   --strict              exit with an error on failure (default: warn and exit 0,
 *                         so a failed upload never fails the app build)
 *
 * Requires Node 18 or later (fetch, FormData, Blob) and the zip command.
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const DEFAULT_BASE_URL = 'https://verify.uxcam.com';
// Same endpoint as uxcam-upload-dsym.sh; it returns the app's "<orgId>/<appId>/" key prefix.
const UPLOAD_PATH = '/v4/dsym';
// Keeps maps apart from the dSYMs under the same prefix.
const SOURCEMAP_FOLDER = 'jsbundle/';
const DEBUG_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const BUNDLE_DEBUG_ID = /__UXCAM_DEBUG_ID__="([0-9a-f-]{36})"/;

function parseArgs(argv) {
    const args = { keepSources: false, dryRun: false, strict: false };
    const takesValue = new Set(['--app-key', '--platform', '--map', '--bundle', '--packager-map', '--debug-id', '--project-root', '--base-url']);
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (takesValue.has(arg)) {
            const key = arg.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
            args[key] = argv[++i];
        } else if (arg === '--keep-sources') {
            args.keepSources = true;
        } else if (arg === '--dry-run') {
            args.dryRun = true;
        } else if (arg === '--strict') {
            args.strict = true;
        } else if (arg === '--help' || arg === '-h') {
            args.help = true;
        } else {
            throw new Error(`Unknown option: ${arg}`);
        }
    }
    args.appKey = args.appKey || process.env.UXCAM_APP_KEY;
    args.baseUrl = (args.baseUrl || process.env.UXCAM_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
    args.projectRoot = args.projectRoot || process.cwd();
    return args;
}

// Android keeps Metro's own map next to the composed one, under intermediates/.
function defaultPackagerMap(mapPath) {
    if (!mapPath) return null;
    const intermediate = mapPath
        .replace(`${path.sep}generated${path.sep}sourcemaps${path.sep}`, `${path.sep}intermediates${path.sep}sourcemaps${path.sep}`)
        .replace(/\.map$/, '.packager.map');
    return intermediate !== mapPath && fs.existsSync(intermediate) ? intermediate : null;
}

function debugIdFromMapFile(mapPath) {
    try {
        const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
        return map.debugId || map.debug_id || null;
    } catch (_) {
        return null;
    }
}

// Order: explicit option, the map's own field (JSC builds), Metro's packager
// map and the serializer's sidecar file (Hermes builds compose a map without
// the field), then the bundle text.
function resolveDebugId({ debugId, map, projectRoot, platform, bundlePath, packagerMap }) {
    const candidates = [
        () => debugId,
        () => map.debugId || map.debug_id,
        () => (packagerMap && fs.existsSync(packagerMap) ? debugIdFromMapFile(packagerMap) : null),
        () => {
            const sidecar = path.join(projectRoot, '.uxcam', `debug-id-${platform}`);
            return fs.existsSync(sidecar) ? fs.readFileSync(sidecar, 'utf8').trim() : null;
        },
        () => {
            if (!bundlePath || !fs.existsSync(bundlePath)) return null;
            const match = BUNDLE_DEBUG_ID.exec(fs.readFileSync(bundlePath, 'latin1'));
            return match ? match[1] : null;
        },
    ];
    for (const candidate of candidates) {
        const value = candidate();
        if (value && DEBUG_ID_PATTERN.test(value)) {
            return value;
        }
    }
    return null;
}

// Removes the app's source code and the build machine's paths before upload.
// Positions, names and React Native's function metadata (x_facebook_sources,
// x_hermes_function_offsets) are kept: symbolication needs them.
function sanitizeMap(map, { projectRoot, keepSources }) {
    const result = { ...map };
    if (!keepSources) {
        delete result.sourcesContent;
    }
    if (Array.isArray(result.sources)) {
        const root = projectRoot.endsWith(path.sep) ? projectRoot : projectRoot + path.sep;
        result.sources = result.sources.map((source) => {
            if (typeof source !== 'string') return source;
            if (source.startsWith(root)) return source.slice(root.length);
            const nodeModules = source.lastIndexOf(`${path.sep}node_modules${path.sep}`);
            if (nodeModules !== -1) return source.slice(nodeModules + 1);
            return source;
        });
    }
    return result;
}

function uploadFileName(debugId, platform) {
    return `${debugId}.${platform}.jsbundle.map`;
}

function uploadKey(prefix, zipName) {
    return `${prefix || ''}${SOURCEMAP_FOLDER}${zipName}`;
}

// The same request the dSYM upload makes: only the app key.
async function requestUploadSlot({ baseUrl, appKey }) {
    const response = await fetch(`${baseUrl}${UPLOAD_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appKey }),
    });
    const json = await response.json().catch(() => null);
    if (!response.ok || !json || json.status !== true || !json.data || !json.data.url) {
        throw new Error(`UXCam did not return an upload slot (HTTP ${response.status}).`);
    }
    return json.data;
}

async function uploadToS3({ url, body }, zipPath, zipName) {
    const fields = { ...(body || {}) };
    delete fields.file;
    // Same convention as the dSYM upload: the returned key is a prefix.
    fields.key = uploadKey(fields.key, zipName);
    const form = new FormData();
    for (const [name, value] of Object.entries(fields)) {
        form.append(name, String(value));
    }
    form.append('file', new Blob([fs.readFileSync(zipPath)]), zipName);
    const response = await fetch(url, { method: 'POST', body: form });
    if (!response.ok) {
        throw new Error(`S3 upload failed (HTTP ${response.status}).`);
    }
    return fields.key;
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
        console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]);
        return;
    }
    if (!args.appKey && !args.dryRun) throw new Error('Pass --app-key or set UXCAM_APP_KEY.');
    if (args.platform !== 'ios' && args.platform !== 'android') throw new Error('Pass --platform ios or --platform android.');
    if (!args.map || !fs.existsSync(args.map)) throw new Error(`No source map at ${args.map}.`);

    const map = JSON.parse(fs.readFileSync(args.map, 'utf8'));
    const packagerMap = args.packagerMap || defaultPackagerMap(args.map);
    const debugId = resolveDebugId({ ...args, map, bundlePath: args.bundle, packagerMap });
    if (!debugId) {
        throw new Error('No debug ID found. Add withUXCamDebugId to metro.config.js, or pass --debug-id.');
    }

    const sanitized = sanitizeMap({ ...map, debugId }, args);
    const fileName = uploadFileName(debugId, args.platform);
    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'uxcam-sourcemap-'));
    const mapPath = path.join(workDir, fileName);
    const zipName = `${fileName}.zip`;
    const zipPath = path.join(workDir, zipName);
    fs.writeFileSync(mapPath, JSON.stringify(sanitized));
    execFileSync('zip', ['-j', '-q', zipPath, mapPath]);

    const sizeKB = Math.round(fs.statSync(zipPath).size / 1024);
    console.log(`[UXCam] Source map ${fileName} (${sizeKB} KB zipped, sources ${args.keepSources ? 'kept' : 'stripped'})`);
    if (args.dryRun) {
        console.log(`[UXCam] Dry run: would POST {appKey} to ${args.baseUrl}${UPLOAD_PATH}, then upload to <prefix>${uploadKey('', zipName)}`);
        console.log(`[UXCam] Dry run: zip kept at ${zipPath}`);
        return;
    }
    try {
        const slot = await requestUploadSlot(args);
        const key = await uploadToS3(slot, zipPath, zipName);
        console.log(`[UXCam] Uploaded source map for debug ID ${debugId} (${key})`);
    } finally {
        fs.rmSync(workDir, { recursive: true, force: true });
    }
}

if (require.main === module) {
    main().catch((error) => {
        const strict = process.argv.includes('--strict');
        console.error(`[UXCam] ${strict ? 'error' : 'warning'}: source map not uploaded: ${error.message}`);
        process.exitCode = strict ? 1 : 0;
    });
}

module.exports = { parseArgs, resolveDebugId, sanitizeMap, uploadFileName, uploadKey, defaultPackagerMap };
