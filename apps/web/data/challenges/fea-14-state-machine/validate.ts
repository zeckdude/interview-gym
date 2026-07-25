import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createStateMachine = getExport<(cfg: {
      initial: string;
      states: Record<string, Record<string, string>>;
    }) => { getState(): string; send(event: string): void }>(exports, 'createStateMachine');

    const machine = createStateMachine({
      initial: 'idle',
      states: {
        idle: { START: 'running' },
        running: { PAUSE: 'paused', STOP: 'idle' },
        paused: { RESUME: 'running', STOP: 'idle' },
      },
    });

    // Test 1: initial state
    const test1 = machine.getState() === 'idle';

    // Test 2: valid transition
    machine.send('START');
    const test2 = machine.getState() === 'running';

    // Test 3: chained transitions
    machine.send('PAUSE');
    machine.send('RESUME');
    const test3 = machine.getState() === 'running';

    // Test 4: invalid event stays in current state
    machine.send('INVALID_EVENT');
    const test4 = machine.getState() === 'running';

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'Starts in initial state', expected: 'idle', actual: machine.getState(), passed: test1 },
        { description: 'Valid transition changes state', expected: 'running (after START)', actual: String(test2 ? 'running' : machine.getState()), passed: test2 },
        { description: 'Chained transitions work correctly', expected: 'running (after PAUSE→RESUME)', actual: machine.getState(), passed: test3 },
        { description: 'Invalid event stays in current state', expected: 'running (unchanged)', actual: machine.getState(), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
