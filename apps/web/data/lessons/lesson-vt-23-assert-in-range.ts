import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt23AssertInRange: Lesson = {
  id: 'lesson-vt-23-assert-in-range',
  title: 'Assert In Range',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'advanced',
  relatedChallengeIds: ['vt-23-assert-in-range'],
  estimatedMinutes: 10,
  concepts: ["numeric assertions"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Assert In Range** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** numeric assertions
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function assertInRange(n, min, max) {
  if (n < min || n > max) throw new Error('Out of range');
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **numeric assertions**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-23-assert-in-range',
    prompt: `Implement \`assertInRange\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function assertInRange(n, min, max) {
  // Implement this function
  
}`,
      typescript: `function assertInRange(n: number, min: number, max: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function assertInRange(n, min, max) {
  if (n < min || n > max) throw new Error('Out of range');
}`,
      typescript: `function assertInRange(n: number, min: number, max: number) {
  if (n < min || n > max) throw new Error('Out of range');
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'assertInRange');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('assertInRange', 'return Boolean(assertInRange(5, 1, 10) === "ok")');
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
    { label: 'Assert In Range', url: 'https://developer.mozilla.org/' }
  ],
};
