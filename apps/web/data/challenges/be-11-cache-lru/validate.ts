import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface LRUCacheClass {
  new (capacity: number): {
    get(key: number): number;
    put(key: number, value: number): void;
  };
}

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const LRUCache = getExport<LRUCacheClass>(exports, 'LRUCache');

    // Test 1: basic put/get
    const c1 = new LRUCache(2);
    c1.put(1, 10);
    c1.put(2, 20);
    const v1 = c1.get(1);
    const test1 = v1 === 10;

    // Test 2: evicts LRU
    const c2 = new LRUCache(2);
    c2.put(1, 1);
    c2.put(2, 2);
    c2.get(1);   // 1 is now MRU
    c2.put(3, 3); // evicts 2
    const evicted = c2.get(2);
    const test2 = evicted === -1;

    // Test 3: get returns -1 for missing
    const c3 = new LRUCache(3);
    const v3 = c3.get(99);
    const test3 = v3 === -1;

    // Test 4: update existing key
    const c4 = new LRUCache(2);
    c4.put(1, 1);
    c4.put(1, 42);
    const v4 = c4.get(1);
    const test4 = v4 === 42;

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'get() returns correct value', expected: '10', actual: String(v1), passed: test1 },
        { description: 'Evicts least recently used on overflow', expected: '-1 (evicted)', actual: String(evicted), passed: test2 },
        { description: 'get() returns -1 for missing key', expected: '-1', actual: String(v3), passed: test3 },
        { description: 'put() updates existing key', expected: '42', actual: String(v4), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
