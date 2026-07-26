// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const totalBoxSize = getExport<(...args: unknown[]) => unknown>(exports, 'totalBoxSize');

    const cases = [
      {
        description: "sums box model",
        run: () => totalBoxSize(100, 8, 1, 16) === 150,
        expected: 150,
        actual: () => String(totalBoxSize(100, 8, 1, 16)),
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
