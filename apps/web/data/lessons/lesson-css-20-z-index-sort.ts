import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss20ZIndexSort: Lesson = {
  id: 'lesson-css-20-z-index-sort',
  title: 'Sort By z-index',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'intermediate',
  relatedChallengeIds: ['css-20-z-index-sort'],
  estimatedMinutes: 10,
  concepts: ["stacking"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Sort By z-index** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** stacking
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function sortByZIndex(items) {
  return [...items].sort((a, b) => a.z - b.z);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **stacking**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-20-z-index-sort',
    prompt: `Implement \`sortByZIndex\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function sortByZIndex(items) {
  // Implement this function
  
}`,
      typescript: `function sortByZIndex(items: Array<{ id: string; z: number }>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function sortByZIndex(items) {
  return [...items].sort((a, b) => a.z - b.z);
}`,
      typescript: `function sortByZIndex(items: Array<{ id: string; z: number }>) {
  return [...items].sort((a, b) => a.z - b.z);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'sortByZIndex');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('sortByZIndex', 'return Boolean(JSON.stringify(sortByZIndex([{"id":"b","z":2},{"id":"a","z":1}])) === JSON.stringify([{"id":"a","z":1},{"id":"b","z":2}]))');
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
    { label: 'Sort By z-index', url: 'https://developer.mozilla.org/' }
  ],
};
