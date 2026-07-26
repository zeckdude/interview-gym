// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const interpolate = getExport<(...args: unknown[]) => unknown>(exports, 'interpolate');

    const cases = [
      {
        description: "fills placeholders",
        run: () => interpolate("Hello {{name}}", {"name":"Ada"}) === "Hello Ada",
        expected: "Hello Ada",
        actual: () => String(interpolate("Hello {{name}}", {"name":"Ada"})),
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
