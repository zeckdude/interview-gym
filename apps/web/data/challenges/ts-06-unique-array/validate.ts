// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const unique = getExport<(...args: unknown[]) => unknown>(exports, 'unique');

    const cases = [
      {
        description: "deduplicates numbers",
        run: () => JSON.stringify(unique([1,2,2,3,1])) === JSON.stringify([1,2,3]),
        expected: [1,2,3],
        actual: () => JSON.stringify(unique([1,2,2,3,1])),
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
