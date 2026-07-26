// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const fluidFontSize = getExport<(...args: unknown[]) => unknown>(exports, 'fluidFontSize');

    const cases = [
      {
        description: "interpolates font size",
        run: () => fluidFontSize(16, 24, 320, 1280, 800) === 20,
        expected: 20,
        actual: () => String(fluidFontSize(16, 24, 320, 1280, 800)),
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
