import { parseStack, MAX_FRAMES } from '../src/stackParser';
import {
    installJSErrorCapture,
    reportNonFatal,
    resetJSErrorCaptureForTesting,
    toPayload,
    createRateLimiter,
} from '../src/jsErrorCapture';

function fakeErrorUtils(previous) {
    let handler = previous;
    return {
        getGlobalHandler: () => handler,
        setGlobalHandler: (next) => { handler = next; },
        fire: (error, isFatal) => handler(error, isFatal),
    };
}

function fakeBridge() {
    return {
        crashes: [],
        errors: [],
        reportJSCrash(payload) { this.crashes.push(payload); return true; },
        reportJSError(payload, properties) { this.errors.push({ payload, properties }); },
    };
}

beforeEach(() => {
    resetJSErrorCaptureForTesting();
    delete global.HermesInternal;
    delete global.__UXCAM_DEBUG_ID__;
});

describe('parseStack', () => {
    test('parses Hermes frames and skips the message line', () => {
        const stack = "TypeError: Cannot read property 'name' of null\n" +
            '    at onPressItem (address at index.android.bundle:1:983744)\n' +
            '    at onPress (/app/src/Screen.tsx:83:28)\n' +
            '    at index.android.bundle:1:12\n' +
            '    at apply (native)';
        expect(parseStack(stack)).toEqual([
            { fn: 'onPressItem', file: 'index.android.bundle', line: 1, col: 983744 },
            { fn: 'onPress', file: 'Screen.tsx', line: 83, col: 28 },
            { fn: '?', file: 'index.android.bundle', line: 1, col: 12 },
        ]);
    });

    test('parses JSC frames, with and without a file', () => {
        expect(parseStack('h@main.jsbundle:1:2340\nglobal code@1:5\n@3:4')).toEqual([
            { fn: 'h', file: 'main.jsbundle', line: 1, col: 2340 },
            { fn: 'global code', line: 1, col: 5 },
            { fn: '?', line: 3, col: 4 },
        ]);
    });

    test('keeps only the file name of an absolute bundle path', () => {
        const stack = '@/private/var/containers/Bundle/Application/1A2B/App.app/main.jsbundle:864:778';
        expect(parseStack(stack)).toEqual([{ fn: '?', file: 'main.jsbundle', line: 864, col: 778 }]);
    });

    test('caps the number of frames and ignores non-strings', () => {
        const stack = Array.from({ length: 150 }, (_, i) => `f${i}@1:${i}`).join('\n');
        expect(parseStack(stack)).toHaveLength(MAX_FRAMES);
        expect(parseStack(undefined)).toEqual([]);
        expect(parseStack(42)).toEqual([]);
    });
});

describe('toPayload', () => {
    test('describes an Error', () => {
        global.HermesInternal = {};
        global.__UXCAM_DEBUG_ID__ = 'abc';
        const error = new TypeError('boom');
        error.stack = 'TypeError: boom\n    at f (address at main.jsbundle:1:10)';
        const payload = toPayload(error, true);
        expect(payload).toMatchObject({
            name: 'TypeError',
            message: 'boom',
            frames: [{ fn: 'f', file: 'main.jsbundle', line: 1, col: 10 }],
            isFatal: true,
            engine: 'hermes',
            debugId: 'abc',
        });
    });

    test('describes a thrown non-Error value with an empty name, like React Native', () => {
        const payload = toPayload('just a string', true);
        expect(payload.name).toBe('');
        expect(payload.message).toBe('just a string');
        expect(payload.frames).toEqual([]);
        expect(payload.engine).toBe('jsc');
        expect(toPayload(null, false).message).toBe('null');
    });

    test('caps long values', () => {
        const error = new Error('x'.repeat(10000));
        error.componentStack = 'c'.repeat(10000);
        const payload = toPayload(error, false);
        expect(payload.message).toHaveLength(4096);
        expect(payload.componentStack).toHaveLength(8192);
    });
});

describe('installJSErrorCapture', () => {
    test('stores a fatal error, then always chains to the previous handler', () => {
        const calls = [];
        const errorUtils = fakeErrorUtils((error, isFatal) => calls.push([error, isFatal]));
        const bridge = fakeBridge();
        expect(installJSErrorCapture(bridge, errorUtils)).toBe(true);

        const error = new Error('fatal');
        errorUtils.fire(error, true);

        expect(bridge.crashes).toHaveLength(1);
        expect(bridge.crashes[0]).toMatchObject({ name: 'Error', message: 'fatal', isFatal: true });
        expect(calls).toEqual([[error, true]]);
    });

    test('chains for non-Error values and records only the first fatal error', () => {
        const calls = [];
        const errorUtils = fakeErrorUtils((error, isFatal) => calls.push([error, isFatal]));
        const bridge = fakeBridge();
        installJSErrorCapture(bridge, errorUtils);

        errorUtils.fire('first', true);
        errorUtils.fire(undefined, true);

        expect(bridge.crashes).toHaveLength(1);
        expect(calls).toEqual([['first', true], [undefined, true]]);
    });

    test('still chains when the bridge throws', () => {
        const calls = [];
        const errorUtils = fakeErrorUtils(() => calls.push('previous'));
        const bridge = { reportJSCrash() { throw new Error('native failure'); }, reportJSError() {} };
        installJSErrorCapture(bridge, errorUtils);

        errorUtils.fire(new Error('x'), true);

        expect(calls).toEqual(['previous']);
    });

    test('installs only once', () => {
        const errorUtils = fakeErrorUtils(() => {});
        const bridge = fakeBridge();
        expect(installJSErrorCapture(bridge, errorUtils)).toBe(true);
        expect(installJSErrorCapture(bridge, errorUtils)).toBe(false);

        errorUtils.fire(new Error('x'), true);
        expect(bridge.crashes).toHaveLength(1);
    });

    test('reports non-fatal errors asynchronously and skips missing ErrorUtils', () => {
        const errorUtils = fakeErrorUtils(() => {});
        const bridge = fakeBridge();
        expect(installJSErrorCapture(bridge, undefined)).toBe(false);
        installJSErrorCapture(bridge, errorUtils);

        errorUtils.fire(new Error('soft'), false);

        expect(bridge.crashes).toHaveLength(0);
        expect(bridge.errors).toHaveLength(1);
        expect(bridge.errors[0].payload).toMatchObject({ message: 'soft', isFatal: false });
    });
});

describe('rate limiting', () => {
    test('drops repeats of one error and caps the window', () => {
        let now = 0;
        const shouldReport = createRateLimiter(() => now);
        const payload = (message) => ({ name: 'Error', message, frames: [] });

        expect([1, 2, 3, 4].map(() => shouldReport(payload('same')))).toEqual([true, true, true, false]);
        let accepted = 0;
        for (let i = 0; i < 50; i++) {
            if (shouldReport(payload(`distinct ${i}`))) accepted += 1;
        }
        expect(accepted).toBe(17); // 20 per window, 3 already used

        now = 60 * 1000;
        expect(shouldReport(payload('same'))).toBe(true);
    });

    test('reportNonFatal passes properties and survives a broken bridge', () => {
        const bridge = fakeBridge();
        expect(reportNonFatal(bridge, new Error('x'), { screen: 'Home' })).toBe(true);
        expect(bridge.errors[0].properties).toEqual({ screen: 'Home' });
        expect(reportNonFatal({ reportJSError() { throw new Error('no'); } }, new Error('y'))).toBe(false);
        expect(reportNonFatal(null, new Error('z'))).toBe(false);
    });
});
