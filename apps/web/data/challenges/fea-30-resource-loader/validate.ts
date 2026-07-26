// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createResourceLoader = getExport<(...args: unknown[]) => unknown>(exports, 'createResourceLoader');

    const cases = [
      {
        description: "tracks loading then success",
        run: async () => Boolean(await (async () => {
                  const loader = createResourceLoader();
                  const data = await loader.load('user', async () => ({ id: 1 }));
                  const state = loader.getState('user');
                  return data.id === 1 && state.status === 'success';
                })()),
        expected: 'true',
        actual: async () => String(await (async () => {
                  const loader = createResourceLoader();
                  const data = await loader.load('user', async () => ({ id: 1 }));
                  const state = loader.getState('user');
                  return data.id === 1 && state.status === 'success';
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
