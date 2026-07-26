// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const shallowDiff = getExport<(...args: unknown[]) => unknown>(exports, 'shallowDiff');

    const cases = [
      {
        description: "finds changed keys",
        run: () => JSON.stringify(shallowDiff({"a":1,"b":2}, {"a":1,"b":9,"c":3})) === JSON.stringify({"b":9,"c":3}),
        expected: {"b":9,"c":3},
        actual: () => JSON.stringify(shallowDiff({"a":1,"b":2}, {"a":1,"b":9,"c":3})),
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
