// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const deepClone = getExport<(...args: unknown[]) => unknown>(exports, 'deepClone');

    const cases = [
      {
        description: "clones nested object",
        run: () => JSON.stringify(deepClone({"a":{"b":[1]}})) === JSON.stringify({"a":{"b":[1]}}),
        expected: {"a":{"b":[1]}},
        actual: () => JSON.stringify(deepClone({"a":{"b":[1]}})),
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
