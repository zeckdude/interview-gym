// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const partition = getExport<(...args: unknown[]) => unknown>(exports, 'partition');

    const cases = [
      {
        description: "splits evens and odds",
        run: () => Boolean(JSON.stringify(partition([1, 2, 3, 4], (n) => n % 2 === 0)) === JSON.stringify([[2, 4], [1, 3]])),
        expected: 'true',
        actual: () => String(JSON.stringify(partition([1, 2, 3, 4], (n) => n % 2 === 0)) === JSON.stringify([[2, 4], [1, 3]])),
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
