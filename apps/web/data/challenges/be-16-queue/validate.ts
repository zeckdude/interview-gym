import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface JobQueue {
  add<T>(job: () => Promise<T>): Promise<T>;
}

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createJobQueue = getExport<(c: number) => JobQueue>(exports, 'createJobQueue');

    // Test 1: all jobs complete with correct results
    const q1 = createJobQueue(2);
    const results = await Promise.all([
      q1.add(async () => 'a'),
      q1.add(async () => 'b'),
      q1.add(async () => 'c'),
    ]);
    const test1 = JSON.stringify(results) === '["a","b","c"]';

    // Test 2: concurrency limiting (track peak active)
    const q2 = createJobQueue(1);
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    let active = 0;
    let peakActive = 0;
    const jobs = [1, 2, 3].map((i) =>
      q2.add(async () => {
        active++;
        peakActive = Math.max(peakActive, active);
        await sleep(10);
        active--;
        return i;
      })
    );
    await Promise.all(jobs);
    const test2 = peakActive === 1;

    // Test 3: propagates errors
    const q3 = createJobQueue(2);
    let errored = false;
    try {
      await q3.add(async () => { throw new Error('oops'); });
    } catch {
      errored = true;
    }
    const test3 = errored;

    return {
      passed: test1 && test2 && test3,
      results: [
        { description: 'All jobs complete with correct results', expected: '["a","b","c"]', actual: JSON.stringify(results), passed: test1 },
        { description: 'Respects concurrency limit of 1', expected: 'peak=1', actual: `peak=${peakActive}`, passed: test2 },
        { description: 'Propagates job errors to caller', expected: 'throws', actual: errored ? 'threw' : 'did not throw', passed: test3 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
