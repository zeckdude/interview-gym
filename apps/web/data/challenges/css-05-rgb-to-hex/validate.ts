// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const rgbToHex = getExport<(...args: unknown[]) => unknown>(exports, 'rgbToHex');

    const cases = [
      {
        description: "formats rgb",
        run: () => rgbToHex(255, 128, 64) === "#ff8040",
        expected: "#ff8040",
        actual: () => String(rgbToHex(255, 128, 64)),
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
