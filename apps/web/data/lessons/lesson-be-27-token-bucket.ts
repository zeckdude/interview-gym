import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonBe27TokenBucket: Lesson = {
  id: 'lesson-be-27-token-bucket',
  title: 'Token Bucket Rate Limiter',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'advanced',
  relatedChallengeIds: ['be-27-token-bucket'],
  estimatedMinutes: 10,
  concepts: ["rate limiting","token bucket","factories"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Token Bucket Rate Limiter** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** rate limiting, token bucket, factories
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createTokenBucket(capacity, refillRate, refillMs) {
  let tokens = capacity;
    let lastRefill = Date.now();
    const refill = () => {
      const now = Date.now();
      const elapsed = now - lastRefill;
      const added = Math.floor(elapsed / refillMs) * refillRate;
      if (added > 0) {
        tokens = Math.min(capacity, tokens + added);
        lastRefill = now;
      }
    };
    return {
      tryConsume(count = 1) {
        refill();
        if (tokens >= count) {
          tokens -= count;
          return true;
        }
        return false;
      },
      getTokens() {
        refill();
        return tokens;
      },
    };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **rate limiting**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-be-27-token-bucket',
    prompt: `Implement \`createTokenBucket(capacity, refillRate, refillMs)\` — allow bursts up to capacity with steady refill.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function createTokenBucket(capacity, refillRate, refillMs) {
  // Implement this function
  
}`,
      typescript: `function createTokenBucket(capacity: number, refillRate: number, refillMs: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function createTokenBucket(capacity, refillRate, refillMs) {
  let tokens = capacity;
    let lastRefill = Date.now();
    const refill = () => {
      const now = Date.now();
      const elapsed = now - lastRefill;
      const added = Math.floor(elapsed / refillMs) * refillRate;
      if (added > 0) {
        tokens = Math.min(capacity, tokens + added);
        lastRefill = now;
      }
    };
    return {
      tryConsume(count = 1) {
        refill();
        if (tokens >= count) {
          tokens -= count;
          return true;
        }
        return false;
      },
      getTokens() {
        refill();
        return tokens;
      },
    };
}`,
      typescript: `function createTokenBucket(capacity: number, refillRate: number, refillMs: number) {
  let tokens = capacity;
    let lastRefill = Date.now();
    const refill = () => {
      const now = Date.now();
      const elapsed = now - lastRefill;
      const added = Math.floor(elapsed / refillMs) * refillRate;
      if (added > 0) {
        tokens = Math.min(capacity, tokens + added);
        lastRefill = now;
      }
    };
    return {
      tryConsume(count = 1) {
        refill();
        if (tokens >= count) {
          tokens -= count;
          return true;
        }
        return false;
      },
      getTokens() {
        refill();
        return tokens;
      },
    };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createTokenBucket');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createTokenBucket', `return Boolean((function () {
                  const bucket = createTokenBucket(2, 1, 1000);
                  return bucket.tryConsume() && bucket.tryConsume() && !bucket.tryConsume();
                })());`);
        const ok = testRunner(result.value);
        return ok
          ? { passed: true, feedback: 'Perfect! All tests passed. ✓' }
          : { passed: false, feedback: 'Not quite — check the requirements and try again.' };
      } catch (e) {
        return { passed: false, feedback: `Error running tests: ${e instanceof Error ? e.message : String(e)}` };
      }
    },
  },
  mdnLinks: [
    { label: 'Token Bucket Rate Limiter', url: 'https://developer.mozilla.org/' }
  ],
};
