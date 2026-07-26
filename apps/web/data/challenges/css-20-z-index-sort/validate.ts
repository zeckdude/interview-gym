// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const sortByZIndex = getExport<(...args: unknown[]) => unknown>(exports, 'sortByZIndex');

    const cases = [
      {
        description: "sorts ascending",
        run: () => JSON.stringify(sortByZIndex([{"id":"b","z":2},{"id":"a","z":1}])) === JSON.stringify([{"id":"a","z":1},{"id":"b","z":2}]),
        expected: [{"id":"a","z":1},{"id":"b","z":2}],
        actual: () => JSON.stringify(sortByZIndex([{"id":"b","z":2},{"id":"a","z":1}])),
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
