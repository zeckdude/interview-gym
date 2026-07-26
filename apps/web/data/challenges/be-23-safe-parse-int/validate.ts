// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const safeParseInt = getExport<(...args: unknown[]) => unknown>(exports, 'safeParseInt');

    const cases = [
      {
        description: "parses valid integer string",
        run: () => safeParseInt("42", 0) === 42,
        expected: 42,
        actual: () => String(safeParseInt("42", 0)),
      },
      {
        description: "returns fallback for non-numeric",
        run: () => safeParseInt("abc", -1) === -1,
        expected: -1,
        actual: () => String(safeParseInt("abc", -1)),
      },
      {
        description: "parses leading digits only",
        run: () => safeParseInt("99px", 0) === 99,
        expected: 99,
        actual: () => String(safeParseInt("99px", 0)),
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
