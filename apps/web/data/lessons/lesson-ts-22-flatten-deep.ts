import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs22FlattenDeep: Lesson = {
  id: 'lesson-ts-22-flatten-deep',
  title: 'Deep Flatten Array',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'advanced',
  relatedChallengeIds: ['ts-22-flatten-deep'],
  estimatedMinutes: 10,
  concepts: ["recursion","arrays"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Deep Flatten Array** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** recursion, arrays
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function flattenDeep(arr) {
  return arr.reduce((acc, item) => acc.concat(Array.isArray(item) ? flattenDeep(item) : item), []);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **recursion**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-22-flatten-deep',
    prompt: `Implement \`flattenDeep\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function flattenDeep(arr) {
  // Implement this function
  
}`,
      typescript: `function flattenDeep(arr: unknown[]) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function flattenDeep(arr) {
  return arr.reduce((acc, item) => acc.concat(Array.isArray(item) ? flattenDeep(item) : item), []);
}`,
      typescript: `function flattenDeep(arr: unknown[]) {
  return arr.reduce((acc, item) => acc.concat(Array.isArray(item) ? flattenDeep(item) : item), []);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'flattenDeep');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('flattenDeep', 'return Boolean(JSON.stringify(flattenDeep([[1],[2,[3]]])) === JSON.stringify([1,2,3]))');
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
    { label: 'Deep Flatten Array', url: 'https://developer.mozilla.org/' }
  ],
};
