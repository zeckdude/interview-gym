import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt02AssertThrows: Lesson = {
  id: 'lesson-vt-02-assert-throws',
  title: 'Assert Throws',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'easy',
  relatedChallengeIds: ['vt-02-assert-throws'],
  estimatedMinutes: 10,
  concepts: ["error assertions"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Assert Throws** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** error assertions
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function assertThrows(fn) {
  try {
      fn();
      throw new Error('Did not throw');
    } catch (e) {
      if (e instanceof Error && e.message === 'Did not throw') throw e;
      return true;
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
    id: 'mini-vt-02-assert-throws',
    prompt: `Implement \`assertThrows\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function assertThrows(fn) {
  // Implement this function
  
}`,
      typescript: `function assertThrows(fn: () => void) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function assertThrows(fn) {
  try {
      fn();
      throw new Error('Did not throw');
    } catch (e) {
      if (e instanceof Error && e.message === 'Did not throw') throw e;
      return true;
    }
}`,
      typescript: `function assertThrows(fn: () => void) {
  try {
      fn();
      throw new Error('Did not throw');
    } catch (e) {
      if (e instanceof Error && e.message === 'Did not throw') throw e;
      return true;
    }
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'assertThrows');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('assertThrows', 'return Boolean(assertThrows(() => { throw new Error(\'boom\'); }) === true)');
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
    { label: 'Assert Throws', url: 'https://developer.mozilla.org/' }
  ],
};
