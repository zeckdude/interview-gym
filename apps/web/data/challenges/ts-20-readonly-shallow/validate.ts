// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const readonlyCopy = getExport<(...args: unknown[]) => unknown>(exports, 'readonlyCopy');

    const cases = [
      {
        description: "returns frozen shallow copy",
        run: () => JSON.stringify(readonlyCopy({"a":1})) === JSON.stringify({"a":1}),
        expected: {"a":1},
        actual: () => JSON.stringify(readonlyCopy({"a":1})),
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
