// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const extractJson = getExport<(...args: unknown[]) => unknown>(exports, 'extractJson');

    const cases = [
      {
        description: "parses fenced json",
        run: () => JSON.stringify(extractJson("Here is data {\"a\":1} done")) === JSON.stringify({"a":1}),
        expected: {"a":1},
        actual: () => JSON.stringify(extractJson("Here is data {\"a\":1} done")),
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
