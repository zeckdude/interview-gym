// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const resolveRedirectPath = getExport<(...args: unknown[]) => unknown>(exports, 'resolveRedirectPath');

    const cases = [
      {
        description: "resolves relative path against base",
        run: () => resolveRedirectPath("/app", "dashboard") === "/app/dashboard",
        expected: "/app/dashboard",
        actual: () => String(resolveRedirectPath("/app", "dashboard")),
      },
      {
        description: "passes through absolute URLs",
        run: () => resolveRedirectPath("/app", "https://example.com") === "https://example.com",
        expected: "https://example.com",
        actual: () => String(resolveRedirectPath("/app", "https://example.com")),
      },
      {
        description: "handles leading slash target",
        run: () => resolveRedirectPath("/app", "/settings") === "/app/settings",
        expected: "/app/settings",
        actual: () => String(resolveRedirectPath("/app", "/settings")),
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
