// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const shallowMerge = getExport<(...args: unknown[]) => unknown>(exports, 'shallowMerge');

    const cases = [
      {
        description: "merges with later keys winning",
        run: () => JSON.stringify(shallowMerge({"a":1,"b":2}, {"b":9,"c":3})) === JSON.stringify({"a":1,"b":9,"c":3}),
        expected: {"a":1,"b":9,"c":3},
        actual: () => JSON.stringify(shallowMerge({"a":1,"b":2}, {"b":9,"c":3})),
      },
      {
        description: "handles empty overrides",
        run: () => JSON.stringify(shallowMerge({"x":1}, {})) === JSON.stringify({"x":1}),
        expected: {"x":1},
        actual: () => JSON.stringify(shallowMerge({"x":1}, {})),
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
