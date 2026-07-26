import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe25PartitionArray: Lesson = {
  id: 'lesson-fe-25-partition-array',
  title: 'Partition Array by Predicate',
  category: 'fe',
  topLevel: 'fe',
  subcategory: null,
  difficulty: 'intermediate',
  relatedChallengeIds: ['fe-25-partition-array'],
  estimatedMinutes: 10,
  concepts: ["arrays","predicates"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Partition Array by Predicate** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** arrays, predicates
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function partition(arr, predicate) {
  const pass = [];
    const fail = [];
    for (const item of arr) {
      if (predicate(item)) pass.push(item);
      else fail.push(item);
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
    id: 'mini-fe-25-partition-array',
    prompt: `Implement \`partition(arr, predicate)\` — return \`[pass, fail]\` tuples split by a predicate.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function partition(arr, predicate) {
  // Implement this function
  
}`,
      typescript: `function partition(arr: number[], predicate: (n: number) => boolean) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function partition(arr, predicate) {
  const pass = [];
    const fail = [];
    for (const item of arr) {
      if (predicate(item)) pass.push(item);
      else fail.push(item);
    }
    return [pass, fail];
}`,
      typescript: `function partition(arr: number[], predicate: (n: number) => boolean) {
  const pass = [];
    const fail = [];
    for (const item of arr) {
      if (predicate(item)) pass.push(item);
      else fail.push(item);
    }
    return [pass, fail];
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'partition');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('partition', `return Boolean(JSON.stringify(partition([1, 2, 3, 4], (n) => n % 2 === 0)) === JSON.stringify([[2, 4], [1, 3]]));`);
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
    { label: 'Partition Array by Predicate', url: 'https://developer.mozilla.org/' }
  ],
};
