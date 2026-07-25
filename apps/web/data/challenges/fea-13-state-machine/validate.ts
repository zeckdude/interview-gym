import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createStateMachine = getExport<(config: {
      initial: string;
      states: Record<string, { on: Record<string, string> }>;
    }) => { getState(): string; send(e: string): void; can(e: string): boolean }>(exports, 'createStateMachine');

    const m = createStateMachine({
      initial: 'idle',
      states: {
        idle:    { on: { FETCH: 'loading' } },
        loading: { on: { SUCCESS: 'success', FAILURE: 'error' } },
        success: { on: { RESET: 'idle' } },
        error:   { on: { RETRY: 'loading', RESET: 'idle' } },
      },
    });

    const test1 = m.getState() === 'idle';

    m.send('FETCH');
    const test2 = m.getState() === 'loading';

    m.send('SUCCESS');
    const test3 = m.getState() === 'success';

    const test4 = m.can('RESET') && !m.can('FETCH');

    m.send('INVALID_EVENT');
    const test5 = m.getState() === 'success'; // no-op

    return {
      passed: test1 && test2 && test3 && test4 && test5,
      results: [
        { description: 'Starts in initial state', expected: 'idle', actual: 'idle', passed: test1 },
        { description: 'FETCH transitions idle → loading', expected: 'loading', actual: m.getState(), passed: test2 },
        { description: 'SUCCESS transitions loading → success', expected: 'success', actual: m.getState(), passed: test3 },
        { description: 'can() returns true/false correctly', expected: 'RESET=true, FETCH=false', actual: `${test4 ? 'ok' : 'fail'}`, passed: test4 },
        { description: 'Invalid event is a no-op', expected: 'success', actual: m.getState(), passed: test5 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
