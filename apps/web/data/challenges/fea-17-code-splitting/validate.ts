import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createLazyLoader = getExport<<T>(loader: () => Promise<T>) => {
      load(): Promise<T>; getStatus(): string; getModule(): T | null; reset(): void;
    }>(exports, 'createLazyLoader');

    const mod = { default: 'MyComponent' };
    let callCount = 0;
    const lazy = createLazyLoader(() => { callCount++; return Promise.resolve(mod); });

    const test1 = lazy.getStatus() === 'idle';

    await lazy.load();
    const test2 = lazy.getStatus() === 'loaded';
    const test3 = lazy.getModule() === mod;

    await lazy.load();
    const test4 = callCount === 1; // cached

    lazy.reset();
    const test5 = lazy.getStatus() === 'idle' && lazy.getModule() === null;

    // Error case
    const failLoader = createLazyLoader(() => Promise.reject(new Error('failed')));
    try { await failLoader.load(); } catch {}
    const test6 = failLoader.getStatus() === 'error';

    return {
      passed: test1 && test2 && test3 && test4 && test5 && test6,
      results: [
        { description: 'Initial status is idle', expected: 'idle', actual: 'idle', passed: test1 },
        { description: 'After load(), status is loaded', expected: 'loaded', actual: lazy.getStatus(), passed: test2 },
        { description: 'getModule() returns loaded module', expected: 'module object', actual: lazy.getModule() ? 'set' : 'null', passed: test3 },
        { description: 'load() called twice only calls loader once', expected: 'callCount=1', actual: `callCount=${callCount}`, passed: test4 },
        { description: 'reset() resets to idle state', expected: 'idle, null', actual: `${lazy.getStatus()}, ${lazy.getModule()}`, passed: test5 },
        { description: 'Failed load sets status to error', expected: 'error', actual: failLoader.getStatus(), passed: test6 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
