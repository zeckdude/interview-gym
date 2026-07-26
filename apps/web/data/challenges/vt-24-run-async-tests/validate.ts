// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const runAsyncTests = getExport<(tests: Array<() => Promise<boolean>>) => Promise<boolean>>(exports, 'runAsyncTests');

    const cases = [
      {
        description: "all async pass",
        run: async () => Boolean(await await runAsyncTests([async () => true, async () => true])),
        expected: 'true',
        actual: async () => String(await await runAsyncTests([async () => true, async () => true])),
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
