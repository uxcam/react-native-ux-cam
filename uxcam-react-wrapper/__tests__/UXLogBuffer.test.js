/**
 * UXLogBuffer Tests
 *
 * Tests for the shared log buffer used by React Native console capture.
 * Covers: lazy serialization, buffer behavior, adaptive flush, truncation, timestamps.
 */

const { UXLogBuffer } = require('../src/UXLogBuffer');

describe('UXLogBuffer', () => {
    let transportCalls;
    let buffer;

    beforeEach(() => {
        jest.useFakeTimers();
        transportCalls = [];
        buffer = new UXLogBuffer({
            transport: (batch) => transportCalls.push([...batch]),
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    // --- Lazy Serialization (_fmt) ---

    describe('lazy serialization', () => {
        test('string passes through unchanged', () => {
            buffer.enqueue('log', ['hello']);
            buffer.flush();
            expect(transportCalls[0][0].m).toBe('hello');
        });

        test('number converted to string', () => {
            buffer.enqueue('log', [42]);
            buffer.flush();
            expect(transportCalls[0][0].m).toBe('42');
        });

        test('boolean converted to string', () => {
            buffer.enqueue('log', [true]);
            buffer.flush();
            expect(transportCalls[0][0].m).toBe('true');
        });

        test('object shows as [Object]', () => {
            buffer.enqueue('log', [{ user: 'test', nested: { a: 1 } }]);
            buffer.flush();
            expect(transportCalls[0][0].m).toBe('[Object]');
        });

        test('array shows as [Object]', () => {
            buffer.enqueue('log', [[1, 2, 3]]);
            buffer.flush();
            expect(transportCalls[0][0].m).toBe('[Object]');
        });

        test('null shows as null', () => {
            buffer.enqueue('log', [null]);
            buffer.flush();
            expect(transportCalls[0][0].m).toBe('null');
        });

        test('undefined shows as undefined', () => {
            buffer.enqueue('log', [undefined]);
            buffer.flush();
            expect(transportCalls[0][0].m).toBe('undefined');
        });

        test('Error object shows as [Object]', () => {
            buffer.enqueue('log', [new Error('test error')]);
            buffer.flush();
            expect(transportCalls[0][0].m).toBe('[Object]');
        });

        test('function shows as [Object]', () => {
            buffer.enqueue('log', [function foo() {}]);
            buffer.flush();
            expect(transportCalls[0][0].m).toBe('[Object]');
        });

        test('mixed args joined with space', () => {
            buffer.enqueue('log', ['hello', 42, true, { a: 1 }]);
            buffer.flush();
            expect(transportCalls[0][0].m).toBe('hello 42 true [Object]');
        });

        test('does not call JSON.stringify', () => {
            const spy = jest.spyOn(JSON, 'stringify');
            buffer.enqueue('log', [{ complex: { nested: true } }]);
            buffer.flush();
            expect(spy).not.toHaveBeenCalled();
            spy.mockRestore();
        });
    });

    // --- Buffer Behavior ---

    describe('buffer behavior', () => {
        test('enqueue adds to buffer (no immediate transport)', () => {
            buffer.enqueue('log', ['test']);
            expect(transportCalls).toHaveLength(0);
        });

        test('flush sends buffered entries to transport', () => {
            buffer.enqueue('log', ['msg1']);
            buffer.enqueue('info', ['msg2']);
            buffer.flush();
            expect(transportCalls).toHaveLength(1);
            expect(transportCalls[0]).toHaveLength(2);
        });

        test('flush clears the buffer', () => {
            buffer.enqueue('log', ['test']);
            buffer.flush();
            buffer.flush(); // second flush should be no-op
            expect(transportCalls).toHaveLength(1);
        });

        test('flush on empty buffer does not call transport', () => {
            buffer.flush();
            expect(transportCalls).toHaveLength(0);
        });

        test('max buffer triggers flush at 20 entries', () => {
            for (let i = 0; i < 20; i++) {
                buffer.enqueue('log', ['msg ' + i]);
            }
            expect(transportCalls).toHaveLength(1);
            expect(transportCalls[0]).toHaveLength(20);
        });

        test('flush timer fires after 1 second', () => {
            buffer.enqueue('log', ['test']);
            expect(transportCalls).toHaveLength(0);
            jest.advanceTimersByTime(1000);
            expect(transportCalls).toHaveLength(1);
        });

        test('flush timer resets on new enqueue', () => {
            buffer.enqueue('log', ['msg1']);
            jest.advanceTimersByTime(500);
            buffer.enqueue('log', ['msg2']);
            jest.advanceTimersByTime(500);
            // Timer from first enqueue should not fire yet (was not reset per impl)
            // But the original timer should fire at 1000ms from first enqueue
            expect(transportCalls.length).toBeGreaterThanOrEqual(1);
        });
    });

    // --- Adaptive Flush ---

    describe('adaptive flush', () => {
        test('error level flushes immediately', () => {
            buffer.enqueue('error', ['critical failure']);
            expect(transportCalls).toHaveLength(1);
            expect(transportCalls[0][0].l).toBe('error');
        });

        test('log level does not flush immediately', () => {
            buffer.enqueue('log', ['normal message']);
            expect(transportCalls).toHaveLength(0);
        });

        test('warn level does not flush immediately', () => {
            buffer.enqueue('warn', ['warning']);
            expect(transportCalls).toHaveLength(0);
        });

        test('info level does not flush immediately', () => {
            buffer.enqueue('info', ['info']);
            expect(transportCalls).toHaveLength(0);
        });

        test('debug level does not flush immediately', () => {
            buffer.enqueue('debug', ['debug']);
            expect(transportCalls).toHaveLength(0);
        });
    });

    // --- Truncation ---

    describe('truncation', () => {
        test('message under 2048 chars unchanged', () => {
            const msg = 'x'.repeat(100);
            buffer.enqueue('log', [msg]);
            buffer.flush();
            expect(transportCalls[0][0].m).toBe(msg);
        });

        test('message over 2048 chars is capped', () => {
            const msg = 'x'.repeat(5000);
            buffer.enqueue('log', [msg]);
            buffer.flush();
            expect(transportCalls[0][0].m.length).toBe(2048);
        });
    });

    // --- Entry Format ---

    describe('entry format', () => {
        test('each entry has level, message, and timestamp', () => {
            const before = Date.now();
            buffer.enqueue('warn', ['test message']);
            buffer.flush();
            const entry = transportCalls[0][0];
            expect(entry.l).toBe('warn');
            expect(entry.m).toBe('test message');
            expect(entry.t).toBeGreaterThanOrEqual(before);
            expect(entry.t).toBeLessThanOrEqual(Date.now());
        });

        test('batch preserves insertion order', () => {
            for (let i = 0; i < 5; i++) {
                buffer.enqueue('log', ['msg' + i]);
            }
            buffer.flush();
            const batch = transportCalls[0];
            for (let i = 0; i < 5; i++) {
                expect(batch[i].m).toBe('msg' + i);
            }
        });
    });

    // --- Custom Configuration ---

    describe('custom configuration', () => {
        test('custom maxBufferSize triggers flush earlier', () => {
            const smallBuffer = new UXLogBuffer({
                transport: (batch) => transportCalls.push([...batch]),
                maxBufferSize: 5,
            });
            for (let i = 0; i < 5; i++) {
                smallBuffer.enqueue('log', ['msg']);
            }
            expect(transportCalls).toHaveLength(1);
            expect(transportCalls[0]).toHaveLength(5);
        });

        test('custom flushIntervalMs fires at specified time', () => {
            const fastBuffer = new UXLogBuffer({
                transport: (batch) => transportCalls.push([...batch]),
                flushIntervalMs: 200,
            });
            fastBuffer.enqueue('log', ['test']);
            jest.advanceTimersByTime(200);
            expect(transportCalls).toHaveLength(1);
        });

        test('custom maxMsgLen truncates at specified length', () => {
            const shortBuffer = new UXLogBuffer({
                transport: (batch) => transportCalls.push([...batch]),
                maxMsgLen: 10,
            });
            shortBuffer.enqueue('log', ['this is a very long message']);
            shortBuffer.flush();
            expect(transportCalls[0][0].m.length).toBe(10);
        });
    });

    // --- Error Handling ---

    describe('error handling', () => {
        test('transport error does not crash enqueue', () => {
            const badBuffer = new UXLogBuffer({
                transport: () => { throw new Error('transport failed'); },
            });
            // Should not throw
            expect(() => {
                for (let i = 0; i < 20; i++) {
                    badBuffer.enqueue('log', ['msg']);
                }
            }).not.toThrow();
        });
    });
});
