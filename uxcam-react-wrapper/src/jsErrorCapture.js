// Captures JavaScript errors through React Native's global ErrorUtils handler.
//
// Fatal errors are handed to the UXCam SDK through a blocking bridge call, so
// the SDK has stored them before React Native crashes the app; the SDK then
// records React Native's crash with the JavaScript name, message and frames.
// Non-fatal errors are reported asynchronously and rate limited.
//
// Kept free of react-native imports so it can be unit tested in plain Node:
// the bridge and the ErrorUtils object are passed in.

import { parseStack } from './stackParser';

const MAX_NAME_LENGTH = 256;
const MAX_MESSAGE_LENGTH = 4096;
const MAX_RAW_STACK_LENGTH = 16384;
const MAX_COMPONENT_STACK_LENGTH = 8192;

// Non-fatal reports: at most this many per window, and per distinct error.
const RATE_WINDOW_MS = 60 * 1000;
const MAX_REPORTS_PER_WINDOW = 20;
const MAX_REPORTS_PER_ERROR = 3;

function capped(value, maxLength) {
    const text = value == null ? '' : String(value);
    return text.length > maxLength ? text.slice(0, maxLength) : text;
}

export function toPayload(error, isFatal, componentStack) {
    const isError = error instanceof Error ||
        (error != null && typeof error === 'object' && typeof error.message === 'string');
    // React Native wraps a thrown non-Error value in an error with an empty name.
    const name = isError ? capped(error.name, MAX_NAME_LENGTH) : '';
    const message = isError ? error.message : String(error);
    const stack = isError && typeof error.stack === 'string' ? error.stack : '';
    const ownComponentStack = isError && typeof error.componentStack === 'string' ? error.componentStack : null;
    const resolvedComponentStack = componentStack || ownComponentStack;

    const payload = {
        name,
        message: capped(message, MAX_MESSAGE_LENGTH),
        frames: parseStack(stack),
        rawStack: capped(stack, MAX_RAW_STACK_LENGTH),
        isFatal: Boolean(isFatal),
        engine: global.HermesInternal != null ? 'hermes' : 'jsc',
        jsTimestamp: Date.now(),
    };
    if (resolvedComponentStack) {
        payload.componentStack = capped(resolvedComponentStack, MAX_COMPONENT_STACK_LENGTH);
    }
    if (typeof global.__UXCAM_DEBUG_ID__ === 'string') {
        payload.debugId = global.__UXCAM_DEBUG_ID__;
    }
    return payload;
}

export function createRateLimiter(now = () => Date.now()) {
    let windowStart = 0;
    let windowCount = 0;
    let perError = new Map();
    return function shouldReport(payload) {
        const time = now();
        if (time - windowStart >= RATE_WINDOW_MS) {
            windowStart = time;
            windowCount = 0;
            perError = new Map();
        }
        const top = payload.frames[0];
        const key = `${payload.name}|${payload.message.slice(0, 200)}|${top ? `${top.fn}@${top.line}:${top.col}` : ''}`;
        const seen = perError.get(key) || 0;
        if (windowCount >= MAX_REPORTS_PER_WINDOW || seen >= MAX_REPORTS_PER_ERROR) {
            return false;
        }
        windowCount += 1;
        perError.set(key, seen + 1);
        return true;
    };
}

let installed = false;
let shouldReportNonFatal = createRateLimiter();

// Reports a non-fatal error, unless the rate limit drops it.
export function reportNonFatal(bridge, error, properties, componentStack) {
    try {
        if (!bridge || typeof bridge.reportJSError !== 'function') {
            return false;
        }
        const payload = toPayload(error, false, componentStack);
        if (!shouldReportNonFatal(payload)) {
            return false;
        }
        bridge.reportJSError(payload, properties || null);
        return true;
    } catch (_) {
        // Reporting must never break the app.
        return false;
    }
}

export function installJSErrorCapture(bridge, errorUtils = global.ErrorUtils) {
    if (installed || !bridge || !errorUtils ||
        typeof errorUtils.getGlobalHandler !== 'function' ||
        typeof errorUtils.setGlobalHandler !== 'function') {
        return false;
    }
    installed = true;

    const previous = errorUtils.getGlobalHandler();
    let handlingFatal = false;

    errorUtils.setGlobalHandler((error, isFatal) => {
        try {
            if (isFatal) {
                if (!handlingFatal && typeof bridge.reportJSCrash === 'function') {
                    handlingFatal = true;
                    // Synchronous: returns once the SDK has stored the error.
                    bridge.reportJSCrash(toPayload(error, true));
                }
            } else {
                reportNonFatal(bridge, error, null);
            }
        } catch (_) {
            // Reporting must never break React Native's own handling.
        }
        if (typeof previous === 'function') {
            // Always chain, including for values that are not Errors, so React
            // Native still shows LogBox in debug and crashes in release.
            previous(error, isFatal);
        }
    });
    return true;
}

// Test-only: undo installation state between tests.
export function resetJSErrorCaptureForTesting() {
    installed = false;
    shouldReportNonFatal = createRateLimiter();
}
