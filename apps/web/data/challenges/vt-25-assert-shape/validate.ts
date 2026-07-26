// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const assertShape = getExport<(...args: unknown[]) => unknown>(exports, 'assertShape');

    const cases = [
      {
        description: "validates types",
        run: () => assertShape({"a":1,"b":"x"}, {"a":"number","b":"string"}) === true,
        expected: true,
        actual: () => String(assertShape({"a":1,"b":"x"}, {"a":"number","b":"string"})),
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
