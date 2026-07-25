import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const curry = getExport<(fn: (...args: any[]) => any) => any>(exports, 'curry');

    const add3 = curry((a: number, b: number, c: number) => a + b + c);

    // Test 1: one at a time
    const r1 = add3(1)(2)(3);
    const test1 = r1 === 6;

    // Test 2: mixed arity
    const r2 = add3(1, 2)(3);
    const test2 = r2 === 6;

    // Test 3: all at once
    const r3 = add3(1, 2, 3);
    const test3 = r3 === 6;

    // Test 4: partial application
    const add5 = add3(5);
    const r4 = add5(1)(2);
    const test4 = r4 === 8;

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'add(1)(2)(3) works', expected: '6', actual: String(r1), passed: test1 },
        { description: 'add(1, 2)(3) works (mixed arity)', expected: '6', actual: String(r2), passed: test2 },
        { description: 'add(1, 2, 3) works (all at once)', expected: '6', actual: String(r3), passed: test3 },
        { description: 'Partial application: add(5)(1)(2) = 8', expected: '8', actual: String(r4), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
