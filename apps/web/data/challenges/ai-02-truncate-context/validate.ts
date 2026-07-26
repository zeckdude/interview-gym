// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const truncateToTokens = getExport<(...args: unknown[]) => unknown>(exports, 'truncateToTokens');

    const cases = [
      {
        description: "truncates long text",
        run: () => truncateToTokens("abcdefgh", 1) === "abcd",
        expected: "abcd",
        actual: () => String(truncateToTokens("abcdefgh", 1)),
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
