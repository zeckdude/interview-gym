// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createAsyncCache = getExport<(...args: unknown[]) => unknown>(exports, 'createAsyncCache');

    const cases = [
      {
        description: "loads once per key",
        run: async () => Boolean(await (async () => {
                  const cache = createAsyncCache();
                  let loads = 0;
                  const loader = async () => { loads += 1; return 'ok'; };
                  await cache.get('a', loader);
                  await cache.get('a', loader);
                  return loads === 1 && cache.has('a');
                })()),
        expected: 'true',
        actual: async () => String(await (async () => {
                  const cache = createAsyncCache();
                  let loads = 0;
                  const loader = async () => { loads += 1; return 'ok'; };
                  await cache.get('a', loader);
                  await cache.get('a', loader);
                  return loads === 1 && cache.has('a');
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
