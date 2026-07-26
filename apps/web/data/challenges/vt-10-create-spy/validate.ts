// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createSpy = getExport<(...args: unknown[]) => unknown>(exports, 'createSpy');

    const cases = [
      {
        description: "forwards return value",
        run: () => Boolean(createSpy((a,b)=>a+b)(2,3) === 5),
        expected: 'true',
        actual: () => String(createSpy((a,b)=>a+b)(2,3) === 5),
      }
    ];

    const results = cases.map((c) => {
      const passed = c.run();
      return {
        description: c.description,
        expected: String(c.expected),
        actual: passed ? 'true' : String(c.actual()),
        passed,
      };
    });

    return { passed: results.every((r) => r.passed), results };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
