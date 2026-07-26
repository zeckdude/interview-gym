import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs15PartitionArray: Lesson = {
  id: 'lesson-ts-15-partition-array',
  title: 'Partition Array',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ts-15-partition-array'],
  estimatedMinutes: 10,
  concepts: ["arrays","predicates"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Partition Array** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** arrays, predicates
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function partition(arr, pred) {
  const pass = [];
    const fail = [];
    for (const item of arr) {
      (pred(item) ? pass : fail).push(item);
    }
    return [pass, fail];
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
    id: 'mini-ts-15-partition-array',
    prompt: `Implement \`partition\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function partition(arr, pred) {
  // Implement this function
  
}`,
      typescript: `function partition(arr: number[], pred: (n: number) => boolean) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function partition(arr, pred) {
  const pass = [];
    const fail = [];
    for (const item of arr) {
      (pred(item) ? pass : fail).push(item);
    }
    return [pass, fail];
}`,
      typescript: `function partition(arr: number[], pred: (n: number) => boolean) {
  const pass = [];
    const fail = [];
    for (const item of arr) {
      (pred(item) ? pass : fail).push(item);
    }
    return [pass, fail];
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'partition');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('partition', 'return Boolean(JSON.stringify(partition([1, 2, 3, 4], (n) => n % 2 === 0)) === JSON.stringify([[2, 4], [1, 3]]))');
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
    { label: 'Partition Array', url: 'https://developer.mozilla.org/' }
  ],
};
