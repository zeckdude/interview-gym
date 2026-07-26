// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const matchMiddlewarePath = getExport<(...args: unknown[]) => unknown>(exports, 'matchMiddlewarePath');

    const cases = [
      {
        description: "exact match",
        run: () => matchMiddlewarePath("/api/health", "/api/health") === true,
        expected: true,
        actual: () => String(matchMiddlewarePath("/api/health", "/api/health")),
      },
      {
        description: "single dynamic segment",
        run: () => matchMiddlewarePath("/users/42", "/users/:id") === true,
        expected: true,
        actual: () => String(matchMiddlewarePath("/users/42", "/users/:id")),
      },
      {
        description: "wildcard prefix match",
        run: () => matchMiddlewarePath("/dashboard/settings", "/dashboard/:path*") === true,
        expected: true,
        actual: () => String(matchMiddlewarePath("/dashboard/settings", "/dashboard/:path*")),
      },
      {
        description: "no match",
        run: () => matchMiddlewarePath("/blog", "/api/:path*") === false,
        expected: false,
        actual: () => String(matchMiddlewarePath("/blog", "/api/:path*")),
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
