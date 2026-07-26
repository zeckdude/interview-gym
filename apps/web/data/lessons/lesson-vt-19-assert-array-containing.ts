import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt19AssertArrayContaining: Lesson = {
  id: 'lesson-vt-19-assert-array-containing',
  title: 'Assert Array Containing',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'intermediate',
  relatedChallengeIds: ['vt-19-assert-array-containing'],
  estimatedMinutes: 10,
  concepts: ["matchers"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Assert Array Containing** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** matchers
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function assertArrayContaining(arr, subset) {
  return subset.every((item) => arr.includes(item));
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **matchers**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-19-assert-array-containing',
    prompt: `Implement \`assertArrayContaining\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function assertArrayContaining(arr, subset) {
  // Implement this function
  
}`,
      typescript: `function assertArrayContaining(arr: unknown[], subset: unknown[]) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function assertArrayContaining(arr, subset) {
  return subset.every((item) => arr.includes(item));
}`,
      typescript: `function assertArrayContaining(arr: unknown[], subset: unknown[]) {
  return subset.every((item) => arr.includes(item));
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'assertArrayContaining');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('assertArrayContaining', 'return Boolean(assertArrayContaining([1,2,3,4], [2,4]) === true)');
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
    { label: 'Assert Array Containing', url: 'https://developer.mozilla.org/' }
  ],
};
