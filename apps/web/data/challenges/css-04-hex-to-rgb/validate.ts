// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const hexToRgb = getExport<(...args: unknown[]) => unknown>(exports, 'hexToRgb');

    const cases = [
      {
        description: "parses hex",
        run: () => JSON.stringify(hexToRgb("#ff8040")) === JSON.stringify({"r":255,"g":128,"b":64}),
        expected: {"r":255,"g":128,"b":64},
        actual: () => JSON.stringify(hexToRgb("#ff8040")),
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
