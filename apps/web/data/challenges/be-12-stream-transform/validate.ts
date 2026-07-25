import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createTransformPipeline = getExport<(...fns: ((x: any) => any)[]) => (items: unknown[]) => unknown[]>(
      exports,
      'createTransformPipeline'
    );

    // Test 1: string transforms
    const p1 = createTransformPipeline(
      (s: string) => s.trim(),
      (s: string) => s.toUpperCase()
    );
    const r1 = p1(['  hello  ', ' world ']);
    const test1 = JSON.stringify(r1) === '["HELLO","WORLD"]';

    // Test 2: number transforms
    const p2 = createTransformPipeline(
      (n: number) => n * 2,
      (n: number) => n + 1
    );
    const r2 = p2([1, 2, 3]);
    const test2 = JSON.stringify(r2) === '[3,5,7]';

    // Test 3: single transform
    const p3 = createTransformPipeline((x: number) => x * 10);
    const r3 = p3([1, 2, 3]);
    const test3 = JSON.stringify(r3) === '[10,20,30]';

    return {
      passed: test1 && test2 && test3,
      results: [
        { description: 'Chains string transforms', expected: '["HELLO","WORLD"]', actual: JSON.stringify(r1), passed: test1 },
        { description: 'Chains number transforms', expected: '[3,5,7]', actual: JSON.stringify(r2), passed: test2 },
        { description: 'Works with single transform', expected: '[10,20,30]', actual: JSON.stringify(r3), passed: test3 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
