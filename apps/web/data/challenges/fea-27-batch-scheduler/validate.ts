// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createBatchScheduler = getExport<(...args: unknown[]) => unknown>(exports, 'createBatchScheduler');

    const cases = [
      {
        description: "queues items before flush",
        run: () => Boolean((function () {
                  const batches = [];
                  const scheduler = createBatchScheduler((batch) => batches.push(batch), 50);
                  scheduler.push(1);
                  scheduler.push(2);
                  return scheduler.size() === 2;
                })()),
        expected: 'true',
        actual: () => String((function () {
                  const batches = [];
                  const scheduler = createBatchScheduler((batch) => batches.push(batch), 50);
                  scheduler.push(1);
                  scheduler.push(2);
                  return scheduler.size() === 2;
                })()),
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
