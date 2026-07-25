import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const deepClone = getExport<<T>(value: T) => T>(exports, 'deepClone');

    // Test 1: nested object is independent
    const original = { a: 1, b: { c: [1, 2, 3] } };
    const clone = deepClone(original);
    (clone.b.c as number[]).push(4);
    const test1 = original.b.c.length === 3 && clone.b.c.length === 4;

    // Test 2: returns equal value
    const obj = { x: { y: { z: 42 } } };
    const c2 = deepClone(obj);
    const test2 = c2.x.y.z === 42 && c2 !== obj && c2.x !== obj.x;

    // Test 3: arrays are deep cloned
    const arr = [[1, 2], [3, 4]];
    const c3 = deepClone(arr);
    (c3[0] as number[]).push(99);
    const test3 = arr[0].length === 2 && c3[0].length === 3;

    // Test 4: primitives returned as-is
    const test4 = deepClone(42) === 42 && deepClone('hello') === 'hello' && deepClone(null) === null;

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'Nested objects are independent (no shared refs)', expected: 'original.b.c.length=3', actual: `original=${original.b.c.length}, clone=${(clone.b.c as number[]).length}`, passed: test1 },
        { description: 'Cloned value equals original but is not same reference', expected: 'equal but different ref', actual: test2 ? 'ok' : 'same ref or wrong value', passed: test2 },
        { description: 'Arrays are deep cloned independently', expected: 'arr[0].length=2', actual: `arr[0]=${arr[0].length}`, passed: test3 },
        { description: 'Primitives returned as-is', expected: 'true', actual: String(test4), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
