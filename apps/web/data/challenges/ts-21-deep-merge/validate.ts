// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const deepMerge = getExport<(...args: unknown[]) => unknown>(exports, 'deepMerge');

    const cases = [
      {
        description: "merges nested objects",
        run: () => JSON.stringify(deepMerge({"a":{"x":1},"b":2}, {"a":{"y":2},"c":3})) === JSON.stringify({"a":{"x":1,"y":2},"b":2,"c":3}),
        expected: {"a":{"x":1,"y":2},"b":2,"c":3},
        actual: () => JSON.stringify(deepMerge({"a":{"x":1},"b":2}, {"a":{"y":2},"c":3})),
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
