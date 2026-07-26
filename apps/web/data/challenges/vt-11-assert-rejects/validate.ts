// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const assertRejects = getExport<(promise: Promise<unknown>) => Promise<boolean>>(exports, 'assertRejects');

    const cases = [
      {
        description: "detects rejection",
        run: async () => Boolean(await await assertRejects(Promise.reject(new Error("fail")))),
        expected: 'true',
        actual: async () => String(await await assertRejects(Promise.reject(new Error("fail")))),
      }
    ];

    const results = [];
    for (const c of cases) {
      const passed = await c.run();
      const actual = passed ? 'true' : await c.actual();
      results.push({
        description: c.description,
        expected: String(c.expected),
        actual,
        passed,
      });
    }

    return { passed: results.every((r) => r.passed), results };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
