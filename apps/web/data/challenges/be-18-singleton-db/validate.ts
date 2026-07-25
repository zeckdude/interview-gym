import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createDatabaseSingleton = getExport<
      <T>(connectFn: () => Promise<T>) => { getInstance(): Promise<T> }
    >(exports, 'createDatabaseSingleton');

    // Test 1: connectFn called exactly once
    let callCount = 0;
    const singleton = createDatabaseSingleton(async () => {
      callCount++;
      return { id: callCount };
    });

    const [a, b, c] = await Promise.all([
      singleton.getInstance(),
      singleton.getInstance(),
      singleton.getInstance(),
    ]);
    const test1 = callCount === 1;

    // Test 2: all calls return same reference
    const test2 = a === b && b === c;

    // Test 3: subsequent calls also return same instance
    const d = await singleton.getInstance();
    const test3 = d === a;

    return {
      passed: test1 && test2 && test3,
      results: [
        { description: 'connectFn called exactly once for concurrent calls', expected: '1', actual: String(callCount), passed: test1 },
        { description: 'All concurrent calls return same reference', expected: 'a === b === c', actual: `a===b:${a === b}, b===c:${b === c}`, passed: test2 },
        { description: 'Subsequent calls return same instance', expected: 'same reference', actual: d === a ? 'same' : 'different', passed: test3 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
