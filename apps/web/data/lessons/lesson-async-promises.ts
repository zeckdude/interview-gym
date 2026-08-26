import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAsyncPromises: Lesson = {
  id: 'lesson-async-promises',
  title: 'Async JavaScript — Promises, async/await, and Error Handling',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'intermediate',
  relatedChallengeIds: ["be-03-async-file-read","be-07-json-parse"],
  estimatedMinutes: 12,
  concepts: ["Promise","async/await","try/catch"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Async JavaScript** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** Promise, async/await, try/catch
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **Promise**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-async-promises',
    prompt: `Implement delay(ms) — returns a Promise that resolves after ms milliseconds.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function delay(ms) {
  // Return a Promise that resolves after ms milliseconds
  
}`,
      typescript: `function delay(ms: number): Promise<void> {
  // Return a Promise that resolves after ms milliseconds
  
}`,
    },
    solution: {
      javascript: `function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}`,
      typescript: `function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'delay');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('delay', 'return Boolean(typeof delay(10).then === \'function\')');
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
    { label: 'Using Promises — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises' }
  ],
};
