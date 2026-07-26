import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt20IsAnyMatcher: Lesson = {
  id: 'lesson-vt-20-is-any-matcher',
  title: 'Any Matcher',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'intermediate',
  relatedChallengeIds: ['vt-20-is-any-matcher'],
  estimatedMinutes: 10,
  concepts: ["matchers"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Any Matcher** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** matchers
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function isAny() {
  return true;
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
    id: 'mini-vt-20-is-any-matcher',
    prompt: `Implement \`isAny\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function isAny() {
  // Implement this function
  
}`,
      typescript: `function isAny() {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function isAny() {
  return true;
}`,
      typescript: `function isAny() {
  return true;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'isAny');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('isAny', 'return Boolean(isAny() === true)');
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
    { label: 'Any Matcher', url: 'https://developer.mozilla.org/' }
  ],
};
