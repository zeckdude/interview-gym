// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const trimString = getExport<(...args: unknown[]) => unknown>(exports, 'trimString');

    const cases = [
      {
        description: "trims both ends",
        run: () => trimString("  hello  ") === "hello",
        expected: "hello",
        actual: () => String(trimString("  hello  ")),
      },
      {
        description: "handles empty string",
        run: () => trimString("") === "",
        expected: "",
        actual: () => String(trimString("")),
      },
      {
        description: "no-op when already trimmed",
        run: () => trimString("world") === "world",
        expected: "world",
        actual: () => String(trimString("world")),
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
