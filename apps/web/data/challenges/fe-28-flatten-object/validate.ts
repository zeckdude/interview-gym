// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const flattenObject = getExport<(...args: unknown[]) => unknown>(exports, 'flattenObject');

    const cases = [
      {
        description: "flattens nested keys with dot paths",
        run: () => JSON.stringify(flattenObject({"a":{"b":1},"c":2})) === JSON.stringify({"a.b":1,"c":2}),
        expected: {"a.b":1,"c":2},
        actual: () => JSON.stringify(flattenObject({"a":{"b":1},"c":2})),
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
