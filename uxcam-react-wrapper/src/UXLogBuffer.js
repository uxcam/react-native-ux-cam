/**
 * UXLogBuffer — Shared log buffer for UXCam JavaScript console log capture.
 *
 * Sentry-inspired design:
 * - Safe serialization: primitives → String(), objects → depth-limited JSON (max 3 levels, 512 chars)
 * - Circular reference protection via WeakSet
 * - Adaptive flush: errors flush immediately, others batch
 * - Configurable buffer size, flush interval, max message length
 * - Transport callback for platform-specific delivery
 */

const DEFAULT_MAX_MSG_LEN = 2048;
const DEFAULT_MAX_BUFFER = 20;
const DEFAULT_FLUSH_INTERVAL_MS = 1000;

class UXLogBuffer {
    constructor({ transport, maxBufferSize, flushIntervalMs, maxMsgLen }) {
        this._transport = transport;
        this._maxBufferSize = maxBufferSize || DEFAULT_MAX_BUFFER;
        this._flushIntervalMs = flushIntervalMs || DEFAULT_FLUSH_INTERVAL_MS;
        this._maxMsgLen = maxMsgLen || DEFAULT_MAX_MSG_LEN;
        this._buffer = [];
        this._timer = null;
    }

    /**
     * Safe serialization with depth limit — gives meaningful object content
     * without the cost/risk of full JSON.stringify (circular refs, huge objects).
     * Max depth 3, max 512 chars per arg, try/catch for safety.
     */
    _fmt(arg) {
        if (arg === undefined) return 'undefined';
        if (arg === null) return 'null';
        const t = typeof arg;
        if (t === 'string') return arg;
        if (t === 'number' || t === 'boolean') return '' + arg;
        if (t === 'function') return '[Function]';
        // Safe stringify with depth limit for objects/arrays
        try {
            const s = this._safeStringify(arg, 3);
            return s.length > 512 ? s.slice(0, 512) + '...' : s;
        } catch (e) {
            return '[Object]';
        }
    }

    /**
     * Depth-limited JSON serialization. Avoids circular ref crashes
     * and limits output size by capping recursion depth.
     * Uses a depth map per-object to track depth correctly across branches.
     */
    _safeStringify(obj, maxDepth) {
        const seen = new WeakSet();
        const depthMap = new WeakMap();
        depthMap.set(obj, 0);
        return JSON.stringify(obj, function (key, value) {
            if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) return '[Circular]';
                seen.add(value);
                // Compute depth: parent depth + 1 (root is 0)
                const parentDepth = (this && typeof this === 'object') ? (depthMap.get(this) || 0) : 0;
                const currentDepth = parentDepth + (key === '' ? 0 : 1);
                depthMap.set(value, currentDepth);
                if (currentDepth >= maxDepth) return Array.isArray(value) ? '[Array]' : '[Object]';
            }
            return value;
        });
    }

    /**
     * Enqueue a log entry. Hot path — must be minimal overhead.
     * @param {string} level - 'log', 'info', 'warn', 'error', 'debug'
     * @param {Array} args - console method arguments
     */
    enqueue(level, args) {
        try {
            const parts = [];
            for (let i = 0; i < args.length; i++) {
                parts.push(this._fmt(args[i]));
            }
            let msg = parts.join(' ');
            if (msg.length > this._maxMsgLen) {
                msg = msg.slice(0, this._maxMsgLen);
            }
            this._buffer.push({ l: level, m: msg, t: Date.now() });

            // Adaptive flush: errors flush immediately
            if (level === 'error') {
                this.flush();
                return;
            }
            if (this._buffer.length >= this._maxBufferSize) {
                this.flush();
                return;
            }
            if (!this._timer) {
                this._timer = setTimeout(() => this.flush(), this._flushIntervalMs);
            }
        } catch (e) {
            // Swallow — never crash the host app's console
        }
    }

    /**
     * Flush all buffered entries to the transport callback.
     */
    flush() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        if (this._buffer.length === 0) return;
        const batch = this._buffer;
        this._buffer = [];
        this._transport(batch);
    }
}

module.exports = { UXLogBuffer };
