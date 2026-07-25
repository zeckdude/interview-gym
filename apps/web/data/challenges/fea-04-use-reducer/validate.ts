import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface Action { type: string; payload?: unknown; }

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createReducerStore = getExport<<S>(r: (s: S, a: Action) => S, init: S) => {
      getState(): S; dispatch(a: Action): void;
    }>(exports, 'createReducerStore');

    const counter = createReducerStore(
      (state: { count: number }, action: Action) => {
        switch (action.type) {
          case 'INCREMENT': return { count: state.count + 1 };
          case 'DECREMENT': return { count: state.count - 1 };
          case 'RESET': return { count: 0 };
          default: return state;
        }
      },
      { count: 0 }
    );

    counter.dispatch({ type: 'INCREMENT' });
    counter.dispatch({ type: 'INCREMENT' });
    const test1 = counter.getState().count === 2;

    counter.dispatch({ type: 'DECREMENT' });
    const test2 = counter.getState().count === 1;

    counter.dispatch({ type: 'RESET' });
    const test3 = counter.getState().count === 0;

    const test4 = counter.getState() !== null && typeof counter.getState().count === 'number';

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'INCREMENT action increments count (0→2)', expected: '2', actual: String(test1 ? 2 : counter.getState().count), passed: test1 },
        { description: 'DECREMENT action decrements count (2→1)', expected: '1', actual: String(test2 ? 1 : counter.getState().count), passed: test2 },
        { description: 'RESET action resets count to 0', expected: '0', actual: String(counter.getState().count), passed: test3 },
        { description: 'getState() returns object with count field', expected: '{ count: number }', actual: test4 ? 'correct' : 'wrong', passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
