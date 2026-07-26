// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createLruCache = getExport<(...args: unknown[]) => unknown>(exports, 'createLruCache');

    const cases = [
      {
        description: "evicts least recently used entry",
        run: () => Boolean((() => { const cache = createLruCache(2); cache.set('a', 1); cache.set('b', 2); cache.get('a'); cache.set('c', 3); return cache.get('b') === undefined && cache.get('a') === 1; })()),
        expected: 'true',
        actual: () => String((() => { const cache = createLruCache(2); cache.set('a', 1); cache.set('b', 2); cache.get('a'); cache.set('c', 3); return cache.get('b') === undefined && cache.get('a') === 1; })()),
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
