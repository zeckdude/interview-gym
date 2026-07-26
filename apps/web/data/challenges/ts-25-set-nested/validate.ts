// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const setNested = getExport<(...args: unknown[]) => unknown>(exports, 'setNested');

    const cases = [
      {
        description: "sets nested value immutably",
        run: () => JSON.stringify(setNested({"a":{"b":1}}, "a.b", 9)) === JSON.stringify({"a":{"b":9}}),
        expected: {"a":{"b":9}},
        actual: () => JSON.stringify(setNested({"a":{"b":1}}, "a.b", 9)),
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
