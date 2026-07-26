// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const parseQuery = getExport<(...args: unknown[]) => unknown>(exports, 'parseQuery');

    const cases = [
      {
        description: "parses query params",
        run: () => JSON.stringify(parseQuery("?a=1&b=two")) === JSON.stringify({"a":"1","b":"two"}),
        expected: {"a":"1","b":"two"},
        actual: () => JSON.stringify(parseQuery("?a=1&b=two")),
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
