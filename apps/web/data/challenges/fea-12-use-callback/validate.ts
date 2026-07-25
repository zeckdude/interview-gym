import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createMemoHook = getExport<() => {
      memo<T>(factory: () => T, deps: unknown[]): T;
    }>(exports, 'createMemoHook');

    const hook = createMemoHook();
    let callCount = 0;

    const v1 = hook.memo(() => { callCount++; return 42; }, ['x', 1]);
    const v2 = hook.memo(() => { callCount++; return 42; }, ['x', 1]); // same deps
    const test1 = v1 === 42 && v2 === 42 && callCount === 1;

    const v3 = hook.memo(() => { callCount++; return 99; }, ['y', 2]); // different deps
    const test2 = v3 === 99 && callCount === 2;

    const hook2 = createMemoHook();
    let c2 = 0;
    hook2.memo(() => { c2++; return 1; }, []);
    hook2.memo(() => { c2++; return 1; }, []);
    const test3 = c2 === 1; // empty deps = stable

    return {
      passed: test1 && test2 && test3,
      results: [
        { description: 'Same deps → factory not called again', expected: 'callCount=1', actual: `callCount=${callCount - (test2 ? 1 : 0)}`, passed: test1 },
        { description: 'Different deps → factory called again', expected: 'v3=99, callCount=2', actual: `v3=${v3}, callCount=${callCount}`, passed: test2 },
        { description: 'Empty deps array is stable across calls', expected: 'callCount=1', actual: `c2=${c2}`, passed: test3 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
