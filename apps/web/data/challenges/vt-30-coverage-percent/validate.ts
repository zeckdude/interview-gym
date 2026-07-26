// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const coveragePercent = getExport<(...args: unknown[]) => unknown>(exports, 'coveragePercent');

    const cases = [
      {
        description: "computes percent",
        run: () => coveragePercent(8, 10) === 80,
        expected: 80,
        actual: () => String(coveragePercent(8, 10)),
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
