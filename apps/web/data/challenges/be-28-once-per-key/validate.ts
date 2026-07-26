// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const oncePerKey = getExport<(...args: unknown[]) => unknown>(exports, 'oncePerKey');

    const cases = [
      {
        description: "runs callback only once per key",
        run: () => Boolean((function () {
                  const run = oncePerKey();
                  let count = 0;
                  run('a', () => { count += 1; });
                  run('a', () => { count += 1; });
                  run('b', () => { count += 1; });
                  return count === 2;
                })()),
        expected: 'true',
        actual: () => String((function () {
                  const run = oncePerKey();
                  let count = 0;
                  run('a', () => { count += 1; });
                  run('a', () => { count += 1; });
                  run('b', () => { count += 1; });
                  return count === 2;
                })()),
      },
      {
        description: "returns true on first run, false on duplicate",
        run: () => Boolean((function () {
                  const run = oncePerKey();
                  const first = run('x', () => {});
                  const second = run('x', () => {});
                  return first === true && second === false;
                })()),
        expected: 'true',
        actual: () => String((function () {
                  const run = oncePerKey();
                  const first = run('x', () => {});
                  const second = run('x', () => {});
                  return first === true && second === false;
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
