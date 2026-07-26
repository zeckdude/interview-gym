// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const summarizeTurns = getExport<(...args: unknown[]) => unknown>(exports, 'summarizeTurns');

    const cases = [
      {
        description: "joins roles",
        run: () => summarizeTurns([{"role":"user","content":"Hi"},{"role":"assistant","content":"Hello"}], 100) === "user: Hi | assistant: Hello",
        expected: "user: Hi | assistant: Hello",
        actual: () => String(summarizeTurns([{"role":"user","content":"Hi"},{"role":"assistant","content":"Hello"}], 100)),
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
