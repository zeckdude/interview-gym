// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const capitalizeWord = getExport<(...args: unknown[]) => unknown>(exports, 'capitalizeWord');

    const cases = [
      {
        description: "capitalizes first letter",
        run: () => capitalizeWord("hello") === "Hello",
        expected: "Hello",
        actual: () => String(capitalizeWord("hello")),
      },
      {
        description: "handles empty string",
        run: () => capitalizeWord("") === "",
        expected: "",
        actual: () => String(capitalizeWord("")),
      },
      {
        description: "leaves rest unchanged",
        run: () => capitalizeWord("javaScript") === "JavaScript",
        expected: "JavaScript",
        actual: () => String(capitalizeWord("javaScript")),
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
