// Parses a JavaScript error stack into frames the UXCam SDKs understand.
// Kept free of react-native imports so it can be unit tested in plain Node.

export const MAX_FRAMES = 100;

// Hermes: "    at fn (address at index.android.bundle:1:983744)" or "    at fn (file.js:12:3)"
const HERMES_FRAME = /^\s*at\s+(.*?)\s+\((?:address at\s+)?(.*?):(\d+):(\d+)\)\s*$/;
// Hermes without a function name: "    at file.js:12:3"
const HERMES_ANONYMOUS_FRAME = /^\s*at\s+()(.*?):(\d+):(\d+)\s*$/;
// JSC: "fn@file.js:12:3"; React Native's native formatting: "fn@12:3"
const JSC_FRAME = /^\s*([^@]*)@(?:(.+):)?(\d+):(\d+)\s*$/;

const FRAME_PATTERNS = [HERMES_FRAME, HERMES_ANONYMOUS_FRAME, JSC_FRAME];

// Keeps only the file name: release builds report the bundle's absolute path
// on the device (…/Containers/Bundle/Application/<uuid>/App.app/main.jsbundle),
// which says nothing useful and differs per install. Source maps are matched by
// bundle, not by that path.
function fileName(file) {
    const slash = file.lastIndexOf('/');
    return slash === -1 ? file : file.slice(slash + 1);
}

function parseLine(line) {
    for (const pattern of FRAME_PATTERNS) {
        const match = pattern.exec(line);
        if (match) {
            const frame = {
                fn: match[1] ? match[1].trim() : '?',
                line: Number(match[3]),
                col: Number(match[4]),
            };
            if (match[2]) {
                frame.file = fileName(match[2]);
            }
            return frame;
        }
    }
    return null;
}

export function parseStack(stack) {
    if (typeof stack !== 'string' || stack.length === 0) {
        return [];
    }
    const frames = [];
    const lines = stack.split('\n');
    for (let i = 0; i < lines.length && frames.length < MAX_FRAMES; i++) {
        const frame = parseLine(lines[i]);
        if (frame) {
            frames.push(frame);
        }
    }
    return frames;
}
