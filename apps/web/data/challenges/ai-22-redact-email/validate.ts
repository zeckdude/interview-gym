// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const redactEmails = getExport<(...args: unknown[]) => unknown>(exports, 'redactEmails');

    const cases = [
      {
        description: "redacts email",
        run: () => redactEmails("Contact ada@example.com please") === "Contact [redacted] please",
        expected: "Contact [redacted] please",
        actual: () => String(redactEmails("Contact ada@example.com please")),
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
