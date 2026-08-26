import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonBe29BackoffJitter: Lesson = {
  id: 'lesson-be-29-backoff-jitter',
  title: 'Exponential Backoff With Jitter',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'advanced',
  relatedChallengeIds: ['be-29-backoff-jitter'],
  estimatedMinutes: 10,
  concepts: ["retry","exponential backoff","jitter"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Exponential Backoff With Jitter** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** retry, exponential backoff, jitter
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function backoffWithJitter(attempt, initialMs, factor, jitterMs) {
  const base = initialMs * Math.pow(factor, attempt);
    const jitter = Math.random() * jitterMs;
    return Math.round(base + jitter);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **retry**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-be-29-backoff-jitter',
    prompt: `Implement \`backoffWithJitter(attempt, initialMs, factor, jitterMs)\` — compute retry delay with random jitter.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function backoffWithJitter(attempt, initialMs, factor, jitterMs) {
  // Implement this function
  
}`,
      typescript: `function backoffWithJitter(attempt: number, initialMs: number, factor: number, jitterMs: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function backoffWithJitter(attempt, initialMs, factor, jitterMs) {
  const base = initialMs * Math.pow(factor, attempt);
    const jitter = Math.random() * jitterMs;
    return Math.round(base + jitter);
}`,
      typescript: `function backoffWithJitter(attempt: number, initialMs: number, factor: number, jitterMs: number) {
  const base = initialMs * Math.pow(factor, attempt);
    const jitter = Math.random() * jitterMs;
    return Math.round(base + jitter);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'backoffWithJitter');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('backoffWithJitter', `return Boolean((function () {
                  const a0 = backoffWithJitter(0, 100, 2, 0);
                  const a2 = backoffWithJitter(2, 100, 2, 0);
                  return a0 === 100 && a2 === 400;
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
    { label: 'Exponential Backoff With Jitter', url: 'https://developer.mozilla.org/' }
  ],
};
