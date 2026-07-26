// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const validateStructured = getExport<(...args: unknown[]) => unknown>(exports, 'validateStructured');

    const cases = [
      {
        description: "checks required keys",
        run: () => validateStructured({"name":"Ada","age":30}, ["name","age"]) === true,
        expected: true,
        actual: () => String(validateStructured({"name":"Ada","age":30}, ["name","age"])),
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
