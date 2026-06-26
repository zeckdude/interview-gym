import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const debounce = getExport<
      (
        fn: (...args: unknown[]) => void,
        delay: number
      ) => { (...args: unknown[]): void; cancel: () => void }
    >(exports, 'debounce');

    let callCount = 0;
    const mockFn = () => {
      callCount += 1;
    };

    const debounced = debounce(mockFn, 100);
    debounced();
    debounced();
    debounced();

    const immediateCount = callCount;
    await delay(150);
    const afterDebounceCount = callCount;

    let cancelCallCount = 0;
    const cancelFn = () => {
      cancelCallCount += 1;
    };
    const debouncedCancel = debounce(cancelFn, 50);
    debouncedCancel();
    debouncedCancel.cancel();
    await delay(100);

    const immediatePassed = immediateCount === 0;
    const debouncePassed = afterDebounceCount === 1;
    const cancelPassed = cancelCallCount === 0;

    return {
      passed: immediatePassed && debouncePassed && cancelPassed,
      results: [
        {
          description: 'Does not call fn immediately on rapid invocations',
          expected: '0 calls before delay',
          actual: String(immediateCount),
          passed: immediatePassed,
        },
        {
          description: 'Calls fn once after delay elapses',
          expected: '1 call after 100ms',
          actual: String(afterDebounceCount),
          passed: debouncePassed,
        },
        {
          description: 'cancel() prevents pending invocation',
          expected: '0 calls after cancel',
          actual: String(cancelCallCount),
          passed: cancelPassed,
        },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
