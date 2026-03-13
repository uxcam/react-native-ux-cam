/**
 * UXLogBuffer — Shared log buffer for UXCam JavaScript console log capture.
 *
 * Sentry-inspired design:
 * - Lazy serialization: primitives → String(), objects → '[Object]' (no JSON.stringify)
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
     * Lazy serialization — avoids JSON.stringify overhead.
     * Primitives are converted via String(), objects show as [Object].
     */
    _fmt(arg) {
        if (arg === undefined) return 'undefined';
        if (arg === null) return 'null';
        const t = typeof arg;
        if (t === 'string') return arg;
        if (t === 'number' || t === 'boolean') return '' + arg;
        // Sentry pattern: don't serialize objects on the hot path
        return '[Object]';
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
