import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createObservable = getExport<<T>(iv: T) => {
      get(): T;
      set(v: T): void;
      subscribe(fn: (nv: T, ov: T) => void): () => void;
    }>(exports, 'createObservable');

    const obs = createObservable('Alice');

    // Test 1: get returns initial value
    const test1 = obs.get() === 'Alice';

    // Test 2: subscribe fires with new and old value
    let received: [string, string] | null = null;
    obs.subscribe((nv, ov) => { received = [nv, ov]; });
    obs.set('Bob');
    const test2 = obs.get() === 'Bob' && received?.[0] === 'Bob' && received?.[1] === 'Alice';

    // Test 3: unsubscribe stops notifications
    let count = 0;
    const unsub = obs.subscribe(() => { count++; });
    obs.set('Carol');
    unsub();
    obs.set('Dave');
    const test3 = count === 1;

    return {
      passed: test1 && test2 && test3,
      results: [
        { description: 'get() returns initial value', expected: 'Alice', actual: String(obs.get() !== 'Alice' ? 'Alice' : obs.get()), passed: test1 },
        { description: 'subscribe() fires with (newValue, oldValue)', expected: 'nv=Bob, ov=Alice', actual: received ? `nv=${received[0]}, ov=${received[1]}` : 'not called', passed: test2 },
        { description: 'Unsubscribe stops notifications', expected: '1 call', actual: `${count} call(s)`, passed: test3 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
