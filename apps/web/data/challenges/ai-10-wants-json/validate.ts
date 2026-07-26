// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const wantsJsonOutput = getExport<(...args: unknown[]) => unknown>(exports, 'wantsJsonOutput');

    const cases = [
      {
        description: "detects json intent",
        run: () => wantsJsonOutput("Return JSON with name field") === true,
        expected: true,
        actual: () => String(wantsJsonOutput("Return JSON with name field")),
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
