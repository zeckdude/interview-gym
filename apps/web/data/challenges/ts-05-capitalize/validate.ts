// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const capitalize = getExport<(...args: unknown[]) => unknown>(exports, 'capitalize');

    const cases = [
      {
        description: "capitalizes word",
        run: () => capitalize("hello") === "Hello",
        expected: "Hello",
        actual: () => String(capitalize("hello")),
      },
      {
        description: "handles empty string",
        run: () => capitalize("") === "",
        expected: "",
        actual: () => String(capitalize("")),
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
