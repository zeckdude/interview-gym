// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createCounterStore = getExport<(...args: unknown[]) => unknown>(exports, 'createCounterStore');

    const cases = [
      {
        description: "increments and decrements",
        run: () => Boolean((function () {
                  const store = createCounterStore(10);
                  store.increment(5);
                  store.decrement(3);
                  return store.getCount() === 12;
                })()),
        expected: 'true',
        actual: () => String((function () {
                  const store = createCounterStore(10);
                  store.increment(5);
                  store.decrement(3);
                  return store.getCount() === 12;
                })()),
      },
      {
        description: "resets to initial",
        run: () => Boolean((function () {
                  const store = createCounterStore(3);
                  store.increment(10);
                  store.reset();
                  return store.getCount() === 3;
                })()),
        expected: 'true',
        actual: () => String((function () {
                  const store = createCounterStore(3);
                  store.increment(10);
                  store.reset();
                  return store.getCount() === 3;
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
