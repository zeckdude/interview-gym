// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const flattenDeep = getExport<(...args: unknown[]) => unknown>(exports, 'flattenDeep');

    const cases = [
      {
        description: "flattens nested arrays",
        run: () => JSON.stringify(flattenDeep([[1],[2,[3]]])) === JSON.stringify([1,2,3]),
        expected: [1,2,3],
        actual: () => JSON.stringify(flattenDeep([[1],[2,[3]]])),
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
