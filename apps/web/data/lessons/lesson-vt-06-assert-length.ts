import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt06AssertLength: Lesson = {
  id: 'lesson-vt-06-assert-length',
  title: 'Assert Length',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'easy',
  relatedChallengeIds: ['vt-06-assert-length'],
  estimatedMinutes: 10,
  concepts: ["arrays"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Assert Length** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** arrays
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function assertLength(arr, len) {
  if (arr.length !== len) throw new Error('Expected length ' + len);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **arrays**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-06-assert-length',
    prompt: `Implement \`assertLength\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function assertLength(arr, len) {
  // Implement this function
  
}`,
      typescript: `function assertLength(arr: unknown[], len: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function assertLength(arr, len) {
  if (arr.length !== len) throw new Error('Expected length ' + len);
}`,
      typescript: `function assertLength(arr: unknown[], len: number) {
  if (arr.length !== len) throw new Error('Expected length ' + len);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'assertLength');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('assertLength', 'return Boolean(assertLength([1,2,3], 3) === "ok")');
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
    { label: 'Assert Length', url: 'https://developer.mozilla.org/' }
  ],
};
