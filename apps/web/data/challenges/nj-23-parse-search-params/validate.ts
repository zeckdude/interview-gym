// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const parseSearchParams = getExport<(...args: unknown[]) => unknown>(exports, 'parseSearchParams');

    const cases = [
      {
        description: "parses single values",
        run: () => JSON.stringify(parseSearchParams("?q=hello&page=2")) === JSON.stringify({"q":"hello","page":"2"}),
        expected: {"q":"hello","page":"2"},
        actual: () => JSON.stringify(parseSearchParams("?q=hello&page=2")),
      },
      {
        description: "collects duplicate keys into arrays",
        run: () => JSON.stringify(parseSearchParams("tag=a&tag=b")) === JSON.stringify({"tag":["a","b"]}),
        expected: {"tag":["a","b"]},
        actual: () => JSON.stringify(parseSearchParams("tag=a&tag=b")),
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
