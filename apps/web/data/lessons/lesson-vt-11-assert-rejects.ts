import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt11AssertRejects: Lesson = {
  id: 'lesson-vt-11-assert-rejects',
  title: 'Assert Rejects',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'intermediate',
  relatedChallengeIds: ['vt-11-assert-rejects'],
  estimatedMinutes: 10,
  concepts: ["async tests"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Assert Rejects** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** async tests
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function assertRejects(promise) {
  try {
      await promise;
      return false;
    } catch {
      return true;
    }
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **async tests**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-11-assert-rejects',
    prompt: `Implement \`assertRejects\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function assertRejects(promise) {
  // Implement this function
  
}`,
      typescript: `function assertRejects(promise: Promise<unknown>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function assertRejects(promise) {
  try {
      await promise;
      return false;
    } catch {
      return true;
    }
}`,
      typescript: `function assertRejects(promise: Promise<unknown>) {
  try {
      await promise;
      return false;
    } catch {
      return true;
    }
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'assertRejects');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('assertRejects', 'return Boolean(await assertRejects(Promise.reject(new Error("fail"))))');
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
    { label: 'Assert Rejects', url: 'https://developer.mozilla.org/' }
  ],
};
