import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface EmitterClass {
  new (): {
    on(event: string, listener: (...args: unknown[]) => void): unknown;
    off(event: string, listener: (...args: unknown[]) => void): unknown;
    emit(event: string, ...args: unknown[]): void;
    once(event: string, listener: (...args: unknown[]) => void): unknown;
  };
}

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const EventEmitter = getExport<EmitterClass>(exports, 'EventEmitter');

    // Test 1: on/emit
    const e1 = new EventEmitter();
    let received: unknown = null;
    e1.on('data', (x) => { received = x; });
    e1.emit('data', 42);
    const test1 = received === 42;

    // Test 2: off removes listener
    const e2 = new EventEmitter();
    let count2 = 0;
    const handler = () => { count2++; };
    e2.on('click', handler);
    e2.off('click', handler);
    e2.emit('click');
    const test2 = count2 === 0;

    // Test 3: once fires only once
    const e3 = new EventEmitter();
    let count3 = 0;
    e3.once('ping', () => { count3++; });
    e3.emit('ping');
    e3.emit('ping');
    const test3 = count3 === 1;

    // Test 4: multiple listeners
    const e4 = new EventEmitter();
    let sum = 0;
    e4.on('num', (n) => { sum += n as number; });
    e4.on('num', (n) => { sum += n as number; });
    e4.emit('num', 5);
    const test4 = sum === 10;

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'on() + emit() calls listener with args', expected: '42', actual: String(received), passed: test1 },
        { description: 'off() removes listener', expected: '0 calls', actual: `${count2} calls`, passed: test2 },
        { description: 'once() fires exactly one time', expected: '1 call', actual: `${count3} calls`, passed: test3 },
        { description: 'Multiple listeners all called on emit', expected: '10', actual: String(sum), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
