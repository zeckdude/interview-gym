import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface Counter {
  increment(): void;
  decrement(): void;
  reset(): void;
  getCount(): number;
}

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createCounter = getExport<(initial?: number) => Counter>(exports, 'createCounter');

    const c = createCounter(5);
    c.increment();
    c.increment();
    const after2 = c.getCount();
    const test1 = after2 === 7;

    c.decrement();
    const afterDec = c.getCount();
    const test2 = afterDec === 6;

    c.reset();
    const afterReset = c.getCount();
    const test3 = afterReset === 5;

    const c2 = createCounter();
    const test4 = c2.getCount() === 0;

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'increment() adds 1 (5 → 7 after 2 increments)', expected: '7', actual: String(after2), passed: test1 },
        { description: 'decrement() subtracts 1 (7 → 6)', expected: '6', actual: String(afterDec), passed: test2 },
        { description: 'reset() returns to initial value (5)', expected: '5', actual: String(afterReset), passed: test3 },
        { description: 'Default initial value is 0', expected: '0', actual: String(c2.getCount()), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
