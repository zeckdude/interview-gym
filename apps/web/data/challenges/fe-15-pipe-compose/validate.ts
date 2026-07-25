import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pipe = getExport<(...fns: Array<(x: any) => any>) => (x: any) => any>(exports, 'pipe');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const compose = getExport<(...fns: Array<(x: any) => any>) => (x: any) => any>(exports, 'compose');

    const double = (x: number) => x * 2;
    const addOne = (x: number) => x + 1;
    const square = (x: number) => x * x;

    // Test 1: pipe left-to-right
    const piped = pipe(double, addOne, square);
    const r1 = piped(3); // (3*2+1)^2 = 49
    const test1 = r1 === 49;

    // Test 2: compose right-to-left (same result for symmetric ops)
    const composed = compose(square, addOne, double);
    const r2 = composed(3); // square(addOne(double(3))) = 49
    const test2 = r2 === 49;

    // Test 3: pipe with 1 function
    const r3 = pipe(double)(5);
    const test3 = r3 === 10;

    // Test 4: compose with 1 function
    const r4 = compose(addOne)(9);
    const test4 = r4 === 10;

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'pipe(double, addOne, square)(3) = 49', expected: '49', actual: String(r1), passed: test1 },
        { description: 'compose(square, addOne, double)(3) = 49', expected: '49', actual: String(r2), passed: test2 },
        { description: 'pipe with single function works', expected: '10', actual: String(r3), passed: test3 },
        { description: 'compose with single function works', expected: '10', actual: String(r4), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
