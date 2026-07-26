// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const contrastRatio = getExport<(...args: unknown[]) => unknown>(exports, 'contrastRatio');

    const cases = [
      {
        description: "computes ratio",
        run: () => contrastRatio(1, 0.2) === 4.25,
        expected: 4.25,
        actual: () => String(contrastRatio(1, 0.2)),
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
