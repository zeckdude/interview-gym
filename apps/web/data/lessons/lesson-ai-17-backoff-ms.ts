import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi17BackoffMs: Lesson = {
  id: 'lesson-ai-17-backoff-ms',
  title: 'Exponential Backoff',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ai-17-backoff-ms'],
  estimatedMinutes: 10,
  concepts: ["rate limits"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Exponential Backoff** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** rate limits
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function exponentialBackoff(attempt, base) {
  return base * Math.pow(2, attempt);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **rate limits**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-17-backoff-ms',
    prompt: `Implement \`exponentialBackoff\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function exponentialBackoff(attempt, base) {
  // Implement this function
  
}`,
      typescript: `function exponentialBackoff(attempt: number, base: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function exponentialBackoff(attempt, base) {
  return base * Math.pow(2, attempt);
}`,
      typescript: `function exponentialBackoff(attempt: number, base: number) {
  return base * Math.pow(2, attempt);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'exponentialBackoff');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('exponentialBackoff', 'return Boolean(exponentialBackoff(2, 100) === 400)');
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
    { label: 'Exponential Backoff', url: 'https://developer.mozilla.org/' }
  ],
};
