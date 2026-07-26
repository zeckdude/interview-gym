// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const rerankDocs = getExport<(...args: unknown[]) => unknown>(exports, 'rerankDocs');

    const cases = [
      {
        description: "sorts by score desc",
        run: () => Boolean(JSON.stringify(rerankDocs('react', ['vue guide', 'react hooks'], (q, d) => (d.includes('react') ? 1 : 0))) === JSON.stringify(['react hooks', 'vue guide'])),
        expected: 'true',
        actual: () => String(JSON.stringify(rerankDocs('react', ['vue guide', 'react hooks'], (q, d) => (d.includes('react') ? 1 : 0))) === JSON.stringify(['react hooks', 'vue guide'])),
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
