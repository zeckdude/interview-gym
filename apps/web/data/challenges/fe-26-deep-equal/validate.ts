// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const deepEqual = getExport<(...args: unknown[]) => unknown>(exports, 'deepEqual');

    const cases = [
      {
        description: "compares nested objects",
        run: () => deepEqual({"a":{"b":1}}, {"a":{"b":1}}) === true,
        expected: true,
        actual: () => String(deepEqual({"a":{"b":1}}, {"a":{"b":1}})),
      },
      {
        description: "detects differences",
        run: () => deepEqual({"a":1}, {"a":2}) === false,
        expected: false,
        actual: () => String(deepEqual({"a":1}, {"a":2})),
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
