// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const spacingScale = getExport<(...args: unknown[]) => unknown>(exports, 'spacingScale');

    const cases = [
      {
        description: "builds scale",
        run: () => JSON.stringify(spacingScale(4, 3)) === JSON.stringify([4,8,12]),
        expected: [4,8,12],
        actual: () => JSON.stringify(spacingScale(4, 3)),
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
