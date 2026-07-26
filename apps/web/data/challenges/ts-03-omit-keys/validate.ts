// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const omit = getExport<(...args: unknown[]) => unknown>(exports, 'omit');

    const cases = [
      {
        description: "omits listed keys",
        run: () => JSON.stringify(omit({"a":1,"b":2,"c":3}, ["b"])) === JSON.stringify({"a":1,"c":3}),
        expected: {"a":1,"c":3},
        actual: () => JSON.stringify(omit({"a":1,"b":2,"c":3}, ["b"])),
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
