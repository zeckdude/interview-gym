// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createTokenBucket = getExport<(...args: unknown[]) => unknown>(exports, 'createTokenBucket');

    const cases = [
      {
        description: "consumes tokens when available",
        run: () => Boolean((function () {
                  const bucket = createTokenBucket(2, 1, 1000);
                  return bucket.tryConsume() && bucket.tryConsume() && !bucket.tryConsume();
                })()),
        expected: 'true',
        actual: () => String((function () {
                  const bucket = createTokenBucket(2, 1, 1000);
                  return bucket.tryConsume() && bucket.tryConsume() && !bucket.tryConsume();
                })()),
      },
      {
        description: "tracks remaining tokens",
        run: () => Boolean((function () {
                  const bucket = createTokenBucket(3, 1, 1000);
                  bucket.tryConsume(2);
                  return bucket.getTokens() === 1;
                })()),
        expected: 'true',
        actual: () => String((function () {
                  const bucket = createTokenBucket(3, 1, 1000);
                  bucket.tryConsume(2);
                  return bucket.getTokens() === 1;
                })()),
      }
    ];

    const results = cases.map((c) => {
      const passed = c.run();
      return {
        description: c.description,
        expected: String(c.expected),
        actual: passed ? 'true' : String(c.actual()),
        passed,
      };
    });

    return { passed: results.every((r) => r.passed), results };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
