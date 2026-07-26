// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const chunk = getExport<(...args: unknown[]) => unknown>(exports, 'chunk');

    const cases = [
      {
        description: "splits into fixed-size chunks",
        run: () => JSON.stringify(chunk([1,2,3,4,5], 2)) === JSON.stringify([[1,2],[3,4],[5]]),
        expected: [[1,2],[3,4],[5]],
        actual: () => JSON.stringify(chunk([1,2,3,4,5], 2)),
      },
      {
        description: "returns empty for empty input",
        run: () => JSON.stringify(chunk([], 3)) === JSON.stringify([]),
        expected: [],
        actual: () => JSON.stringify(chunk([], 3)),
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
