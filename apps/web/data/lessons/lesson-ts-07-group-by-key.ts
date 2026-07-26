import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs07GroupByKey: Lesson = {
  id: 'lesson-ts-07-group-by-key',
  title: 'Group By Key Function',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'easy',
  relatedChallengeIds: ['ts-07-group-by-key'],
  estimatedMinutes: 10,
  concepts: ["reduce","records"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Group By Key Function** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** reduce, records
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
      const key = String(keyFn(item));
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **reduce**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-07-group-by-key',
    prompt: `Implement \`groupBy\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function groupBy(arr, keyFn) {
  // Implement this function
  
}`,
      typescript: `function groupBy(arr: unknown[], keyFn: (item: unknown) => string | number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
      const key = String(keyFn(item));
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
}`,
      typescript: `function groupBy(arr: unknown[], keyFn: (item: unknown) => string | number) {
  return arr.reduce((acc, item) => {
      const key = String(keyFn(item));
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'groupBy');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('groupBy', 'return Boolean(JSON.stringify(groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? \'even\' : \'odd\'))) === JSON.stringify({ odd: [1, 3], even: [2, 4] }))');
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
    { label: 'Group By Key Function', url: 'https://developer.mozilla.org/' }
  ],
};
