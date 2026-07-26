// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const arrayToRecord = getExport<(...args: unknown[]) => unknown>(exports, 'arrayToRecord');

    const cases = [
      {
        description: "indexes by id",
        run: () => Boolean(JSON.stringify(arrayToRecord([{ id: 'a', v: 1 }, { id: 'b', v: 2 }], (item) => item.id)) === JSON.stringify({ a: { id: 'a', v: 1 }, b: { id: 'b', v: 2 } })),
        expected: 'true',
        actual: () => String(JSON.stringify(arrayToRecord([{ id: 'a', v: 1 }, { id: 'b', v: 2 }], (item) => item.id)) === JSON.stringify({ a: { id: 'a', v: 1 }, b: { id: 'b', v: 2 } })),
      }
    ];

    const results = cases.map((c) => {
      const passed = c.run();
      return {
        description: c.description,
        expected: String(c.expected),
        actual: passed ? 'true' : String(c.actual()),
        passed,
      };
    });

    return { passed: results.every((r) => r.passed), results };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
