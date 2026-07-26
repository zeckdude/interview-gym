// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const topoSort = getExport<(...args: unknown[]) => unknown>(exports, 'topoSort');

    const cases = [
      {
        description: "orders dependencies",
        run: () => JSON.stringify(topoSort({"a":["b"],"b":["c"],"c":[]})) === JSON.stringify(["c","b","a"]),
        expected: ["c","b","a"],
        actual: () => JSON.stringify(topoSort({"a":["b"],"b":["c"],"c":[]})),
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
