import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs09FlattenOnce: Lesson = {
  id: 'lesson-ts-09-flatten-once',
  title: 'Flatten One Level',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'easy',
  relatedChallengeIds: ['ts-09-flatten-once'],
  estimatedMinutes: 10,
  concepts: ["arrays","flat"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Flatten One Level** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** arrays, flat
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function flattenOnce(arr) {
  return arr.reduce((acc, item) => acc.concat(item), []);
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
    id: 'mini-ts-09-flatten-once',
    prompt: `Implement \`flattenOnce\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function flattenOnce(arr) {
  // Implement this function
  
}`,
      typescript: `function flattenOnce(arr: unknown[][]) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function flattenOnce(arr) {
  return arr.reduce((acc, item) => acc.concat(item), []);
}`,
      typescript: `function flattenOnce(arr: unknown[][]) {
  return arr.reduce((acc, item) => acc.concat(item), []);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'flattenOnce');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('flattenOnce', 'return Boolean(JSON.stringify(flattenOnce([[1,2],[3]])) === JSON.stringify([1,2,3]))');
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
    { label: 'Flatten One Level', url: 'https://developer.mozilla.org/' }
  ],
};
