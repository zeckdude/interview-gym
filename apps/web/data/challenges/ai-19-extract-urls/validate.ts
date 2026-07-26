// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const extractUrls = getExport<(...args: unknown[]) => unknown>(exports, 'extractUrls');

    const cases = [
      {
        description: "finds urls",
        run: () => JSON.stringify(extractUrls("See https://example.com and https://a.com/x")) === JSON.stringify(["https://example.com","https://a.com/x"]),
        expected: ["https://example.com","https://a.com/x"],
        actual: () => JSON.stringify(extractUrls("See https://example.com and https://a.com/x")),
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
