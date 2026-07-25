import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createAnimationController = getExport<(opts: {
      duration: number; clock?: { now(): number };
    }) => { play(): void; pause(): void; stop(): void; getState(): string; getProgress(): number }>(exports, 'createAnimationController');

    let time = 0;
    const clock = { now: () => time };
    const anim = createAnimationController({ duration: 1000, clock });

    const test1 = anim.getState() === 'idle' && anim.getProgress() === 0;

    anim.play();
    time = 500;
    const p1 = anim.getProgress();
    const test2 = Math.abs(p1 - 0.5) < 0.01;

    anim.pause();
    const test3 = anim.getState() === 'paused';
    time = 800;
    const test4 = Math.abs(anim.getProgress() - 0.5) < 0.01; // paused, shouldn't change

    anim.play();
    time = 800 + 500; // resume from 0.5 → needs 500ms more
    const p2 = anim.getProgress();
    const test5 = p2 >= 0.99 || anim.getState() === 'finished';

    anim.stop();
    const test6 = anim.getState() === 'idle' && anim.getProgress() === 0;

    return {
      passed: test1 && test2 && test3 && test4 && test5 && test6,
      results: [
        { description: 'Initial state: idle, progress=0', expected: 'idle, 0', actual: `${anim.getState()}, ${anim.getProgress()}`, passed: test1 },
        { description: 'At 500ms of 1000ms duration: progress≈0.5', expected: '~0.5', actual: String(p1.toFixed(2)), passed: test2 },
        { description: 'pause() sets state to paused', expected: 'paused', actual: anim.getState(), passed: test3 },
        { description: 'Progress frozen while paused', expected: '~0.5', actual: String(anim.getProgress().toFixed(2)), passed: test4 },
        { description: 'Resume from pause, runs to completion', expected: '≥0.99 or finished', actual: `${p2.toFixed(2)}`, passed: test5 },
        { description: 'stop() resets to idle, progress=0', expected: 'idle, 0', actual: `${anim.getState()}, ${anim.getProgress()}`, passed: test6 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
