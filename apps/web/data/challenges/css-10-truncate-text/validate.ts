// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const truncate = getExport<(...args: unknown[]) => unknown>(exports, 'truncate');

    const cases = [
      {
        description: "truncates long text",
        run: () => truncate("Hello world", 8) === "Hello w…",
        expected: "Hello w…",
        actual: () => String(truncate("Hello world", 8)),
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
