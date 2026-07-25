import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

type Status = 'idle' | 'loading' | 'error' | 'success';

interface AsyncState<T> {
  run(fn: () => Promise<T>): Promise<void>;
  getStatus(): Status;
  getData(): T | null;
  getError(): unknown;
  reset(): void;
}

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createAsyncState = getExport<() => AsyncState<string>>(exports, 'createAsyncState');

    const state = createAsyncState();
    const test1 = state.getStatus() === 'idle';

    const runPromise = state.run(async () => {
      await new Promise((r) => setTimeout(r, 15));
      return 'loaded!';
    });
    const test2 = state.getStatus() === 'loading';

    await runPromise;
    const test3 = state.getStatus() === 'success' && state.getData() === 'loaded!';

    const state2 = createAsyncState();
    await state2.run(async () => {
      throw new Error('network down');
    });
    const test4 = state2.getStatus() === 'error' && state2.getError() !== null;

    state2.reset();
    const test5 = state2.getStatus() === 'idle' && state2.getData() === null && state2.getError() === null;

    return {
      passed: test1 && test2 && test3 && test4 && test5,
      results: [
        { description: 'Starts in "idle" status', expected: 'idle', actual: state.getStatus(), passed: test1 },
        { description: 'Status is "loading" while the function is running', expected: 'loading', actual: test2 ? 'loading' : 'wrong status', passed: test2 },
        { description: 'Status becomes "success" with the resolved data', expected: 'success + "loaded!"', actual: `${state.getStatus()} + ${JSON.stringify(state.getData())}`, passed: test3 },
        { description: 'Status becomes "error" with the thrown error, without crashing', expected: 'error + Error set', actual: `${state2.getStatus()} + ${state2.getError() ? 'error set' : 'null'}`, passed: test4 },
        { description: 'reset() clears everything back to idle', expected: 'idle, null, null', actual: `${state2.getStatus()}, ${state2.getData()}, ${state2.getError()}`, passed: test5 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
