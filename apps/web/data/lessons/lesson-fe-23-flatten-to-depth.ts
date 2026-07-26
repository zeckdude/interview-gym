import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe23FlattenToDepth: Lesson = {
  id: 'lesson-fe-23-flatten-to-depth',
  title: 'Flatten Array to Depth',
  category: 'fe',
  topLevel: 'fe',
  subcategory: null,
  difficulty: 'easy',
  relatedChallengeIds: ['fe-23-flatten-to-depth'],
  estimatedMinutes: 10,
  concepts: ["arrays","recursion"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Flatten Array to Depth** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** arrays, recursion
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function flattenToDepth(arr, depth) {
  return arr.reduce((acc, item) => {
      if (Array.isArray(item) && depth > 0) {
        acc.push(...flattenToDepth(item, depth - 1));
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
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
    id: 'mini-fe-23-flatten-to-depth',
    prompt: `Implement \`flattenToDepth(arr, depth)\` — flatten nested arrays up to a given depth.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function flattenToDepth(arr, depth) {
  // Implement this function
  
}`,
      typescript: `function flattenToDepth(arr: unknown[], depth: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function flattenToDepth(arr, depth) {
  return arr.reduce((acc, item) => {
      if (Array.isArray(item) && depth > 0) {
        acc.push(...flattenToDepth(item, depth - 1));
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
}`,
      typescript: `function flattenToDepth(arr: unknown[], depth: number) {
  return arr.reduce((acc, item) => {
      if (Array.isArray(item) && depth > 0) {
        acc.push(...flattenToDepth(item, depth - 1));
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'flattenToDepth');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('flattenToDepth', `return Boolean(JSON.stringify(flattenToDepth([[1,2],[3]], 1)) === JSON.stringify([1,2,3]));`);
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
    { label: 'Flatten Array to Depth', url: 'https://developer.mozilla.org/' }
  ],
};
