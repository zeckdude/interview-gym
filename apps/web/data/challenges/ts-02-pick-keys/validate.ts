// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const pick = getExport<(...args: unknown[]) => unknown>(exports, 'pick');

    const cases = [
      {
        description: "picks selected keys",
        run: () => JSON.stringify(pick({"a":1,"b":2,"c":3}, ["a","c"])) === JSON.stringify({"a":1,"c":3}),
        expected: {"a":1,"c":3},
        actual: () => JSON.stringify(pick({"a":1,"b":2,"c":3}, ["a","c"])),
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
