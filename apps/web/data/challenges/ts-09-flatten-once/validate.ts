// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const flattenOnce = getExport<(...args: unknown[]) => unknown>(exports, 'flattenOnce');

    const cases = [
      {
        description: "flattens one level",
        run: () => JSON.stringify(flattenOnce([[1,2],[3]])) === JSON.stringify([1,2,3]),
        expected: [1,2,3],
        actual: () => JSON.stringify(flattenOnce([[1,2],[3]])),
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
