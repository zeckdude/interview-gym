// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const invertObject = getExport<(...args: unknown[]) => unknown>(exports, 'invertObject');

    const cases = [
      {
        description: "swaps keys and values",
        run: () => JSON.stringify(invertObject({"a":"1","b":"2"})) === JSON.stringify({"1":"a","2":"b"}),
        expected: {"1":"a","2":"b"},
        actual: () => JSON.stringify(invertObject({"a":"1","b":"2"})),
      },
      {
        description: "later keys overwrite on collision",
        run: () => JSON.stringify(invertObject({"x":"dup","y":"dup"})) === JSON.stringify({"dup":"y"}),
        expected: {"dup":"y"},
        actual: () => JSON.stringify(invertObject({"x":"dup","y":"dup"})),
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
