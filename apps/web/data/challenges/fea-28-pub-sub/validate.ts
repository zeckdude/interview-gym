// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createPubSub = getExport<(...args: unknown[]) => unknown>(exports, 'createPubSub');

    const cases = [
      {
        description: "delivers published payloads",
        run: () => Boolean((function () {
                  const bus = createPubSub();
                  let received = null;
                  bus.subscribe('msg', (p) => { received = p; });
                  bus.publish('msg', 42);
                  return received === 42;
                })()),
        expected: 'true',
        actual: () => String((function () {
                  const bus = createPubSub();
                  let received = null;
                  bus.subscribe('msg', (p) => { received = p; });
                  bus.publish('msg', 42);
                  return received === 42;
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
