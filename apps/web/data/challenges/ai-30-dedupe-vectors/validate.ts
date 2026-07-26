// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const dedupeSimilar = getExport<(...args: unknown[]) => unknown>(exports, 'dedupeSimilar');

    const cases = [
      {
        description: "removes near duplicates",
        run: () => Boolean(JSON.stringify(dedupeSimilar([{ id: 'a', vector: [1, 0] }, { id: 'b', vector: [0.99, 0.01] }], 0.9, (a, b) => a[0] * b[0] + a[1] * b[1])) === JSON.stringify([{ id: 'a', vector: [1, 0] }])),
        expected: 'true',
        actual: () => String(JSON.stringify(dedupeSimilar([{ id: 'a', vector: [1, 0] }, { id: 'b', vector: [0.99, 0.01] }], 0.9, (a, b) => a[0] * b[0] + a[1] * b[1])) === JSON.stringify([{ id: 'a', vector: [1, 0] }])),
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
