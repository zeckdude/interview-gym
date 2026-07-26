import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt03AssertIncludes: Lesson = {
  id: 'lesson-vt-03-assert-includes',
  title: 'Assert Includes',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'easy',
  relatedChallengeIds: ['vt-03-assert-includes'],
  estimatedMinutes: 10,
  concepts: ["arrays","strings"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Assert Includes** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** arrays, strings
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function assertIncludes(haystack, needle) {
  if (!haystack.includes(needle)) throw new Error('Missing ' + needle);
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
    id: 'mini-vt-03-assert-includes',
    prompt: `Implement \`assertIncludes\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function assertIncludes(haystack, needle) {
  // Implement this function
  
}`,
      typescript: `function assertIncludes(haystack: unknown[], needle: unknown) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function assertIncludes(haystack, needle) {
  if (!haystack.includes(needle)) throw new Error('Missing ' + needle);
}`,
      typescript: `function assertIncludes(haystack: unknown[], needle: unknown) {
  if (!haystack.includes(needle)) throw new Error('Missing ' + needle);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'assertIncludes');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('assertIncludes', 'return Boolean(assertIncludes([1,2,3], 2) === "ok")');
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
    { label: 'Assert Includes', url: 'https://developer.mozilla.org/' }
  ],
};
