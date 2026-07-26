// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const backoffWithJitter = getExport<(...args: unknown[]) => unknown>(exports, 'backoffWithJitter');

    const cases = [
      {
        description: "grows exponentially with attempt",
        run: () => Boolean((function () {
                  const a0 = backoffWithJitter(0, 100, 2, 0);
                  const a2 = backoffWithJitter(2, 100, 2, 0);
                  return a0 === 100 && a2 === 400;
                })()),
        expected: 'true',
        actual: () => String((function () {
                  const a0 = backoffWithJitter(0, 100, 2, 0);
                  const a2 = backoffWithJitter(2, 100, 2, 0);
                  return a0 === 100 && a2 === 400;
                })()),
      },
      {
        description: "adds jitter within range",
        run: () => Boolean((function () {
                  const delay = backoffWithJitter(1, 50, 2, 100);
                  return delay >= 100 && delay <= 200;
                })()),
        expected: 'true',
        actual: () => String((function () {
                  const delay = backoffWithJitter(1, 50, 2, 100);
                  return delay >= 100 && delay <= 200;
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
