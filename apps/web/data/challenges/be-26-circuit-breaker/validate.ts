// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createCircuitBreaker = getExport<(...args: unknown[]) => unknown>(exports, 'createCircuitBreaker');

    const cases = [
      {
        description: "opens after threshold failures",
        run: async () => Boolean(await (async () => {
                  const cb = createCircuitBreaker(2);
                  try { await cb.execute(async () => { throw new Error('fail'); }); } catch {}
                  try { await cb.execute(async () => { throw new Error('fail'); }); } catch {}
                  return cb.isOpen();
                })()),
        expected: 'true',
        actual: async () => String(await (async () => {
                  const cb = createCircuitBreaker(2);
                  try { await cb.execute(async () => { throw new Error('fail'); }); } catch {}
                  try { await cb.execute(async () => { throw new Error('fail'); }); } catch {}
                  return cb.isOpen();
                })()),
      },
      {
        description: "passes through successful calls",
        run: async () => Boolean(await (async () => {
                  const cb = createCircuitBreaker(3);
                  const value = await cb.execute(async () => 42);
                  return value === 42 && !cb.isOpen();
                })()),
        expected: 'true',
        actual: async () => String(await (async () => {
                  const cb = createCircuitBreaker(3);
                  const value = await cb.execute(async () => 42);
                  return value === 42 && !cb.isOpen();
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
