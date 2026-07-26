// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const resolveToken = getExport<(...args: unknown[]) => unknown>(exports, 'resolveToken');

    const cases = [
      {
        description: "follows token alias",
        run: () => resolveToken("color.text", {"color.brand":"#ff6b35","color.text":"{color.brand}"}) === "#ff6b35",
        expected: "#ff6b35",
        actual: () => String(resolveToken("color.text", {"color.brand":"#ff6b35","color.text":"{color.brand}"})),
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
