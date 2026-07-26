import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe27RunWithConcurrency: Lesson = {
  id: 'lesson-fe-27-run-with-concurrency',
  title: 'Run Tasks With Concurrency Limit',
  category: 'fe',
  topLevel: 'fe',
  subcategory: null,
  difficulty: 'advanced',
  relatedChallengeIds: ['fe-27-run-with-concurrency'],
  estimatedMinutes: 10,
  concepts: ["async","concurrency","Promises"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Run Tasks With Concurrency Limit** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** async, concurrency, Promises
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `async function runWithConcurrency(tasks, limit) {
  const results = new Array(tasks.length);
    let nextIndex = 0;
    async function worker() {
      while (nextIndex < tasks.length) {
        const i = nextIndex++;
        results[i] = await tasks[i]();
      }
    }
    const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
    await Promise.all(workers);
    return results;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **async**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fe-27-run-with-concurrency',
    prompt: `Implement \`runWithConcurrency(tasks, limit)\` — run async tasks with at most \`limit\` in flight.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `async function runWithConcurrency(tasks, limit) {
  // Implement this function
  
}`,
      typescript: `async function runWithConcurrency(tasks: Array<() => Promise<number>>, limit: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `async function runWithConcurrency(tasks, limit) {
  const results = new Array(tasks.length);
    let nextIndex = 0;
    async function worker() {
      while (nextIndex < tasks.length) {
        const i = nextIndex++;
        results[i] = await tasks[i]();
      }
    }
    const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
    await Promise.all(workers);
    return results;
}`,
      typescript: `async function runWithConcurrency(tasks: Array<() => Promise<number>>, limit: number) {
  const results = new Array(tasks.length);
    let nextIndex = 0;
    async function worker() {
      while (nextIndex < tasks.length) {
        const i = nextIndex++;
        results[i] = await tasks[i]();
      }
    }
    const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
    await Promise.all(workers);
    return results;
}`,
    },
    validate: async (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'runWithConcurrency');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('runWithConcurrency', `return ((async () => {
                  const tasks = [() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)];
                  const results = await runWithConcurrency(tasks, 2);
                  return JSON.stringify(results) === JSON.stringify([1, 2, 3]);
                })());`);
        const ok = Boolean(await testRunner(result.value));
        return ok
          ? { passed: true, feedback: 'Perfect! All tests passed. ✓' }
          : { passed: false, feedback: 'Not quite — check the requirements and try again.' };
      } catch (e) {
        return { passed: false, feedback: `Error running tests: ${e instanceof Error ? e.message : String(e)}` };
      }
    },
  },
  mdnLinks: [
    { label: 'Run Tasks With Concurrency Limit', url: 'https://developer.mozilla.org/' }
  ],
};
