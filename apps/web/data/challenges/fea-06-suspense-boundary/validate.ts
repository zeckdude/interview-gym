import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createSuspenseBoundary = getExport<
      <F>(opts: { fallback: F }) => {
        render<R>(fn: () => Promise<R>): Promise<R>;
        getStatus(): string;
        getResult(): unknown;
        getError(): unknown;
        getFallback(): F;
      }
    >(exports, 'createSuspenseBoundary');

    const boundary = createSuspenseBoundary({ fallback: 'Loading...' });

    // Test 1: fallback is accessible
    const test1 = boundary.getFallback() === 'Loading...';

    // Test 2: status is pending while running
    const promise = boundary.render(async () => {
      await new Promise((r) => setTimeout(r, 20));
      return 'content';
    });
    const test2 = boundary.getStatus() === 'pending';

    // Test 3: resolved after completion
    await promise;
    const test3 = boundary.getStatus() === 'resolved' && boundary.getResult() === 'content';

    // Test 4: rejected on error
    const boundary2 = createSuspenseBoundary({ fallback: '...' });
    try { await boundary2.render(async () => { throw new Error('fail'); }); } catch { /* expected */ }
    const test4 = boundary2.getStatus() === 'rejected' && boundary2.getError() !== null;

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'getFallback() returns the fallback value', expected: 'Loading...', actual: String(boundary.getFallback()), passed: test1 },
        { description: 'Status is "pending" while async fn is running', expected: 'pending', actual: test2 ? 'pending' : 'wrong status', passed: test2 },
        { description: 'Status is "resolved" with result after completion', expected: 'resolved + "content"', actual: `${boundary.getStatus()} + "${boundary.getResult()}"`, passed: test3 },
        { description: 'Status is "rejected" with error on failure', expected: 'rejected + error set', actual: `${boundary2.getStatus()} + ${boundary2.getError() ? 'error' : 'null'}`, passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
