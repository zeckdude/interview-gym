// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const isString = getExport<(value: unknown) => value is string>(exports, 'isString');

    const cases = [
      {
        description: "returns true for strings",
        run: () => isString("hello") === true,
        expected: true,
        actual: () => String(isString("hello")),
      },
      {
        description: "returns false for numbers",
        run: () => isString(42) === false,
        expected: false,
        actual: () => String(isString(42)),
      },
      {
        description: "returns false for null",
        run: () => isString(null) === false,
        expected: false,
        actual: () => String(isString(null)),
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
