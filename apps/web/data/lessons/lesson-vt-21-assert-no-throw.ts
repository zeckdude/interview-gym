import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt21AssertNoThrow: Lesson = {
  id: 'lesson-vt-21-assert-no-throw',
  title: 'Assert No Throw',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'advanced',
  relatedChallengeIds: ['vt-21-assert-no-throw'],
  estimatedMinutes: 10,
  concepts: ["error assertions"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Assert No Throw** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** error assertions
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function assertNoThrow(fn) {
  try {
      fn();
      return true;
    } catch {
      return false;
    }
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **error assertions**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-21-assert-no-throw',
    prompt: `Implement \`assertNoThrow\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function assertNoThrow(fn) {
  // Implement this function
  
}`,
      typescript: `function assertNoThrow(fn: () => void) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function assertNoThrow(fn) {
  try {
      fn();
      return true;
    } catch {
      return false;
    }
}`,
      typescript: `function assertNoThrow(fn: () => void) {
  try {
      fn();
      return true;
    } catch {
      return false;
    }
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'assertNoThrow');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('assertNoThrow', 'return Boolean(assertNoThrow(() => { return 1; }) === true)');
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
    { label: 'Assert No Throw', url: 'https://developer.mozilla.org/' }
  ],
};
