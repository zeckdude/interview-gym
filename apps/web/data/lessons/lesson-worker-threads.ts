import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonWorkerThreads: Lesson = {
  id: 'lesson-worker-threads',
  title: 'CPU-Intensive Work — Worker Threads',
  category: 'be-nodejs',
  topLevel: 'be',
  subcategory: 'nodejs',
  difficulty: 'intermediate',
  relatedChallengeIds: ["be-16-queue"],
  estimatedMinutes: 10,
  concepts: ["worker threads","parallelism"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**CPU-Intensive Work** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** worker threads, parallelism
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **worker threads**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-worker-threads',
    prompt: `Implement chunkArray(arr, size) — splits an array into sub-arrays.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function chunkArray(arr, size) {
  
}`,
      typescript: `function chunkArray<T>(arr: T[], size: number): T[][] {
  
}`,
    },
    solution: {
      javascript: `function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}`,
      typescript: `function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'chunkArray');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('chunkArray', 'return Boolean(JSON.stringify(chunkArray([1,2,3,4,5], 2)) === JSON.stringify([[1,2],[3,4],[5]]))');
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
    { label: 'Worker threads — Node.js', url: 'https://nodejs.org/api/worker_threads.html' }
  ],
};
