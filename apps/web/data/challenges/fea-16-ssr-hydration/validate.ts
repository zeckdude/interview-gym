import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createHydrationManager = getExport<() => {
      inject(k: string, d: unknown): void;
      extract<T>(k: string): T | null;
      getAll(): Record<string, unknown>;
    }>(exports, 'createHydrationManager');
    const serialize = getExport<(d: unknown) => string>(exports, 'serialize');
    const deserialize = getExport<<T>(r: string) => T>(exports, 'deserialize');

    // Test 1: serialize/deserialize round trip
    const data = { id: 1, name: 'Alice', tags: ['a', 'b'] };
    const serialized = serialize(data);
    const recovered = deserialize<typeof data>(serialized);
    const test1 = JSON.stringify(recovered) === JSON.stringify(data);

    // Test 2: inject/extract
    const mgr = createHydrationManager();
    mgr.inject('user', { id: 1 });
    const user = mgr.extract<{ id: number }>('user');
    const test2 = user?.id === 1;

    // Test 3: extract unknown key returns null
    const test3 = mgr.extract('missing') === null;

    // Test 4: getAll returns all entries
    mgr.inject('posts', [1, 2, 3]);
    const all = mgr.getAll();
    const test4 = 'user' in all && 'posts' in all;

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'serialize/deserialize round trip', expected: JSON.stringify(data), actual: JSON.stringify(recovered), passed: test1 },
        { description: 'inject/extract retrieves data', expected: '{id:1}', actual: JSON.stringify(user), passed: test2 },
        { description: 'extract unknown key returns null', expected: 'null', actual: String(mgr.extract('missing')), passed: test3 },
        { description: 'getAll returns all injected keys', expected: 'user, posts', actual: Object.keys(all).join(', '), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
