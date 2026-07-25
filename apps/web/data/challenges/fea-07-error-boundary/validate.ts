import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createErrorBoundary = getExport<
      <F>(opts: { fallback: F }) => {
        render<R>(fn: () => R): R | F;
        hasError(): boolean;
        getError(): Error | null;
      }
    >(exports, 'createErrorBoundary');

    // Test 1: success case
    const b1 = createErrorBoundary({ fallback: 'Error!' });
    const r1 = b1.render(() => 'ok');
    const test1 = r1 === 'ok' && !b1.hasError();

    // Test 2: error case
    const b2 = createErrorBoundary({ fallback: 'Something went wrong' });
    const r2 = b2.render(() => { throw new Error('oops'); });
    const test2 = r2 === 'Something went wrong' && b2.hasError();

    // Test 3: getError returns the error
    const err = b2.getError();
    const test3 = err instanceof Error && err.message === 'oops';

    // Test 4: recovers after success
    const b3 = createErrorBoundary({ fallback: 'fallback' });
    b3.render(() => { throw new Error('first'); });
    b3.render(() => 'recovered');
    const test4 = !b3.hasError();

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'Success: returns rendered result, no error', expected: '"ok", hasError=false', actual: `"${r1}", hasError=${b1.hasError()}`, passed: test1 },
        { description: 'Error: returns fallback', expected: '"Something went wrong"', actual: String(r2), passed: test2 },
        { description: 'getError() returns the caught error', expected: 'Error: oops', actual: err?.message ?? 'null', passed: test3 },
        { description: 'Error is cleared after successful render', expected: 'hasError=false', actual: `hasError=${b3.hasError()}`, passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
