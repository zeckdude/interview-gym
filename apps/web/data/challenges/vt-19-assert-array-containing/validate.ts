// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const assertArrayContaining = getExport<(...args: unknown[]) => unknown>(exports, 'assertArrayContaining');

    const cases = [
      {
        description: "contains subset",
        run: () => assertArrayContaining([1,2,3,4], [2,4]) === true,
        expected: true,
        actual: () => String(assertArrayContaining([1,2,3,4], [2,4])),
      }
    ];

    const results = cases.map((c) => {
      const passed = c.run();
      return {
        description: c.description,
        expected: String(c.expected),
        actual: passed ? String(c.expected) : String(c.actual()),
        passed,
      };
    });

    return { passed: results.every((r) => r.passed), results };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
