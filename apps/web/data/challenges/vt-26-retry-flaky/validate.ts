// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const retryTest = getExport<(...args: unknown[]) => unknown>(exports, 'retryTest');

    const cases = [
      {
        description: "retries until success",
        run: () => Boolean((() => { let n = 0; return retryTest(3, () => { n++; if (n < 2) throw new Error('fail'); return 'ok'; }) === 'ok'; })()),
        expected: 'true',
        actual: () => String((() => { let n = 0; return retryTest(3, () => { n++; if (n < 2) throw new Error('fail'); return 'ok'; }) === 'ok'; })()),
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
