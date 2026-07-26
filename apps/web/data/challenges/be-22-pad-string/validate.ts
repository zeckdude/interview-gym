// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const padString = getExport<(...args: unknown[]) => unknown>(exports, 'padString');

    const cases = [
      {
        description: "pads on the right by default",
        run: () => padString("hi", 5) === "hi   ",
        expected: "hi   ",
        actual: () => String(padString("hi", 5)),
      },
      {
        description: "pads on the left",
        run: () => padString("42", 4, "0", "left") === "0042",
        expected: "0042",
        actual: () => String(padString("42", 4, "0", "left")),
      },
      {
        description: "returns original when long enough",
        run: () => padString("hello", 3) === "hello",
        expected: "hello",
        actual: () => String(padString("hello", 3)),
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
