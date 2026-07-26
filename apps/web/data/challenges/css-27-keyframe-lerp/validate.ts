// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const lerp = getExport<(...args: unknown[]) => unknown>(exports, 'lerp');

    const cases = [
      {
        description: "interpolates halfway",
        run: () => lerp(0, 100, 0.5) === 50,
        expected: 50,
        actual: () => String(lerp(0, 100, 0.5)),
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
