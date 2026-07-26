import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs04FilterNullish: Lesson = {
  id: 'lesson-ts-04-filter-nullish',
  title: 'Filter Null and Undefined',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'easy',
  relatedChallengeIds: ['ts-04-filter-nullish'],
  estimatedMinutes: 10,
  concepts: ["nullish","array methods"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Filter Null and Undefined** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** nullish, array methods
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function filterNullish(arr) {
  return arr.filter((item) => item != null);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **nullish**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-04-filter-nullish',
    prompt: `Implement \`filterNullish\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function filterNullish(arr) {
  // Implement this function
  
}`,
      typescript: `function filterNullish(arr: Array<unknown>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function filterNullish(arr) {
  return arr.filter((item) => item != null);
}`,
      typescript: `function filterNullish(arr: Array<unknown>) {
  return arr.filter((item) => item != null);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'filterNullish');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('filterNullish', 'return Boolean(JSON.stringify(filterNullish([1,null,2,null,3])) === JSON.stringify([1,2,3]))');
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
    { label: 'Filter Null and Undefined', url: 'https://developer.mozilla.org/' }
  ],
};
