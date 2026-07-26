// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const sanitizePrompt = getExport<(...args: unknown[]) => unknown>(exports, 'sanitizePrompt');

    const cases = [
      {
        description: "normalizes whitespace",
        run: () => sanitizePrompt("  hello   world  ") === "hello world",
        expected: "hello world",
        actual: () => String(sanitizePrompt("  hello   world  ")),
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
