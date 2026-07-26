// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const matchesClass = getExport<(...args: unknown[]) => unknown>(exports, 'matchesClass');

    const cases = [
      {
        description: "matches class token",
        run: () => matchesClass({"classList":["btn","primary"]}, ".primary") === true,
        expected: true,
        actual: () => String(matchesClass({"classList":["btn","primary"]}, ".primary")),
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
