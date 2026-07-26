import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt26RetryFlaky: Lesson = {
  id: 'lesson-vt-26-retry-flaky',
  title: 'Retry Flaky Test',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'advanced',
  relatedChallengeIds: ['vt-26-retry-flaky'],
  estimatedMinutes: 10,
  concepts: ["flaky tests"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Retry Flaky Test** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** flaky tests
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function retryTest(attempts, fn) {
  let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        return fn();
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **flaky tests**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-26-retry-flaky',
    prompt: `Implement \`retryTest\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function retryTest(attempts, fn) {
  // Implement this function
  
}`,
      typescript: `function retryTest(attempts: number, fn: () => string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function retryTest(attempts, fn) {
  let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        return fn();
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError;
}`,
      typescript: `function retryTest(attempts: number, fn: () => string) {
  let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        return fn();
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'retryTest');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('retryTest', 'return Boolean((() => { let n = 0; return retryTest(3, () => { n++; if (n < 2) throw new Error(\'fail\'); return \'ok\'; }) === \'ok\'; })())');
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
    { label: 'Retry Flaky Test', url: 'https://developer.mozilla.org/' }
  ],
};
