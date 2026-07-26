// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const getNested = getExport<(...args: unknown[]) => unknown>(exports, 'getNested');

    const cases = [
      {
        description: "reads nested path",
        run: () => getNested({"a":{"b":3}}, "a.b") === 3,
        expected: 3,
        actual: () => String(getNested({"a":{"b":3}}, "a.b")),
      },
      {
        description: "returns undefined for missing",
        run: () => getNested({"a":1}, "a.c.d") === undefined,
        expected: undefined,
        actual: () => String(getNested({"a":1}, "a.c.d")),
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
