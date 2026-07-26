import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonBe26CircuitBreaker: Lesson = {
  id: 'lesson-be-26-circuit-breaker',
  title: 'Circuit Breaker Factory',
  category: 'be',
  topLevel: 'be',
  subcategory: null,
  difficulty: 'advanced',
  relatedChallengeIds: ['be-26-circuit-breaker'],
  estimatedMinutes: 10,
  concepts: ["resilience","circuit breaker","factories"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Circuit Breaker Factory** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** resilience, circuit breaker, factories
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createCircuitBreaker(threshold) {
  let failures = 0;
    let open = false;
    return {
      async execute(fn) {
        if (open) throw new Error('Circuit open');
        try {
          const result = await fn();
          failures = 0;
          return result;
        } catch (err) {
          failures += 1;
          if (failures >= threshold) open = true;
          throw err;
        }
      },
      isOpen() {
        return open;
      },
      reset() {
        failures = 0;
        open = false;
      },
    };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **resilience**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-be-26-circuit-breaker',
    prompt: `Implement \`createCircuitBreaker(threshold)\` — a factory that stops calling a failing dependency after repeated errors.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function createCircuitBreaker(threshold) {
  // Implement this function
  
}`,
      typescript: `function createCircuitBreaker(threshold: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function createCircuitBreaker(threshold) {
  let failures = 0;
    let open = false;
    return {
      async execute(fn) {
        if (open) throw new Error('Circuit open');
        try {
          const result = await fn();
          failures = 0;
          return result;
        } catch (err) {
          failures += 1;
          if (failures >= threshold) open = true;
          throw err;
        }
      },
      isOpen() {
        return open;
      },
      reset() {
        failures = 0;
        open = false;
      },
    };
}`,
      typescript: `function createCircuitBreaker(threshold: number) {
  let failures = 0;
    let open = false;
    return {
      async execute(fn) {
        if (open) throw new Error('Circuit open');
        try {
          const result = await fn();
          failures = 0;
          return result;
        } catch (err) {
          failures += 1;
          if (failures >= threshold) open = true;
          throw err;
        }
      },
      isOpen() {
        return open;
      },
      reset() {
        failures = 0;
        open = false;
      },
    };
}`,
    },
    validate: async (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createCircuitBreaker');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createCircuitBreaker', `return ((async () => {
                  const cb = createCircuitBreaker(2);
                  try { await cb.execute(async () => { throw new Error('fail'); }); } catch {}
                  try { await cb.execute(async () => { throw new Error('fail'); }); } catch {}
                  return cb.isOpen();
                })());`);
        const ok = Boolean(await testRunner(result.value));
        return ok
          ? { passed: true, feedback: 'Perfect! All tests passed. ✓' }
          : { passed: false, feedback: 'Not quite — check the requirements and try again.' };
      } catch (e) {
        return { passed: false, feedback: `Error running tests: ${e instanceof Error ? e.message : String(e)}` };
      }
    },
  },
  mdnLinks: [
    { label: 'Circuit Breaker Factory', url: 'https://developer.mozilla.org/' }
  ],
};
