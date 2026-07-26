// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const runWithConcurrency = getExport<(...args: unknown[]) => unknown>(exports, 'runWithConcurrency');

    const cases = [
      {
        description: "runs all tasks and preserves order",
        run: async () => Boolean(await (async () => {
                  const tasks = [() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)];
                  const results = await runWithConcurrency(tasks, 2);
                  return JSON.stringify(results) === JSON.stringify([1, 2, 3]);
                })()),
        expected: 'true',
        actual: async () => String(await (async () => {
                  const tasks = [() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)];
                  const results = await runWithConcurrency(tasks, 2);
                  return JSON.stringify(results) === JSON.stringify([1, 2, 3]);
                })()),
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
