import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface RateLimiter {
  isAllowed(): boolean;
}

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createRateLimiter = getExport<(maxCalls: number, windowMs: number) => RateLimiter>(
      exports,
      'createRateLimiter'
    );

    // Test 1: allows up to maxCalls
    const limiter1 = createRateLimiter(3, 60000);
    const r1 = [limiter1.isAllowed(), limiter1.isAllowed(), limiter1.isAllowed()];
    const test1 = r1.every(Boolean);

    // Test 2: blocks after maxCalls exceeded
    const limiter2 = createRateLimiter(2, 60000);
    limiter2.isAllowed();
    limiter2.isAllowed();
    const blocked = limiter2.isAllowed();
    const test2 = blocked === false;

    // Test 3: is a function that returns the object shape
    const limiter3 = createRateLimiter(5, 1000);
    const test3 = typeof limiter3.isAllowed === 'function';

    return {
      passed: test1 && test2 && test3,
      results: [
        {
          description: 'Allows calls up to maxCalls limit',
          expected: 'true, true, true',
          actual: r1.join(', '),
          passed: test1,
        },
        {
          description: 'Blocks call that exceeds the limit',
          expected: 'false',
          actual: String(blocked),
          passed: test2,
        },
        {
          description: 'Returns object with isAllowed() method',
          expected: 'function',
          actual: typeof limiter3.isAllowed,
          passed: test3,
        },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
