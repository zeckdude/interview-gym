import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonWebWorkers: Lesson = {
  id: 'lesson-web-workers',
  title: 'Web Workers — Non-Blocking UI',
  category: 'fe',
  topLevel: 'fe',
  subcategory: null,
  difficulty: 'intermediate',
  relatedChallengeIds: ["fe-20-fetch-retry"],
  estimatedMinutes: 10,
  concepts: ["Web Workers","postMessage"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Web Workers** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** Web Workers, postMessage
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function sumLargeArray(nums) {
  return nums.reduce((a, b) => a + b, 0);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **Web Workers**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-web-workers',
    prompt: `Implement sumLargeArray(nums).`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function sumLargeArray(nums) {
  
}`,
      typescript: `function sumLargeArray(nums: number[]): number {
  
}`,
    },
    solution: {
      javascript: `function sumLargeArray(nums) {
  return nums.reduce((a, b) => a + b, 0);
}`,
      typescript: `function sumLargeArray(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'sumLargeArray');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('sumLargeArray', 'return Boolean(sumLargeArray([1,2,3,4]) === 10)');
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
    { label: 'Web Workers — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API' }
  ],
};
