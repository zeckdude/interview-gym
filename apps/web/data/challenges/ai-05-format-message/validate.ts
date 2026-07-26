// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const formatMessage = getExport<(...args: unknown[]) => unknown>(exports, 'formatMessage');

    const cases = [
      {
        description: "builds message object",
        run: () => JSON.stringify(formatMessage("user", "Hi")) === JSON.stringify({"role":"user","content":"Hi"}),
        expected: {"role":"user","content":"Hi"},
        actual: () => JSON.stringify(formatMessage("user", "Hi")),
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
