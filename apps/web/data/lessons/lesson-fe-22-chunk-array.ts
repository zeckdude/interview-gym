import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe22ChunkArray: Lesson = {
  id: 'lesson-fe-22-chunk-array',
  title: 'Chunk Array',
  category: 'fe',
  topLevel: 'fe',
  subcategory: null,
  difficulty: 'easy',
  relatedChallengeIds: ['fe-22-chunk-array'],
  estimatedMinutes: 10,
  concepts: ["arrays","slicing"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Chunk Array** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** arrays, slicing
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function chunk(arr, size) {
  const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
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
    id: 'mini-fe-22-chunk-array',
    prompt: `Implement \`chunk(arr, size)\` — split an array into sub-arrays of at most \`size\` items.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function chunk(arr, size) {
  // Implement this function
  
}`,
      typescript: `function chunk(arr: unknown[], size: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function chunk(arr, size) {
  const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
}`,
      typescript: `function chunk(arr: unknown[], size: number) {
  const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'chunk');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('chunk', `return Boolean(JSON.stringify(chunk([1,2,3,4,5], 2)) === JSON.stringify([[1,2],[3,4],[5]]));`);
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
    { label: 'Chunk Array', url: 'https://developer.mozilla.org/' }
  ],
};
