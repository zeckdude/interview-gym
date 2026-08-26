import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe27RunWithConcurrency: Lesson = {
  id: 'lesson-fe-27-run-with-concurrency',
  title: 'Run Tasks With Concurrency Limit',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'advanced',
  relatedChallengeIds: ['fe-27-run-with-concurrency'],
  estimatedMinutes: 15,
  concepts: ['async', 'concurrency', 'Promises'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
You need to upload 200 files to S3. Firing all 200 \`fetch\` calls at once will crash the browser or hit rate limits. Running them one-at-a-time is too slow.

**Concurrency-limited task runners** appear in almost every senior frontend/backend interview involving async work. The pattern: keep exactly \`limit\` tasks in flight, start the next when one finishes.
      `,
    },
    {
      type: 'explanation',
      title: 'How Concurrency Limiting Works',
      content: `
Each **task** is a function returning a Promise: \`() => Promise<T>\`.

The worker pool pattern:

1. Create \`limit\` worker functions (not \`limit\` tasks — workers are reusable)
2. Each worker loops: grab the next task index, await it, repeat until no tasks remain
3. Use a shared \`nextIndex\` counter so workers don't collide
4. \`Promise.all(workers)\` waits for every worker to finish

**Key insight:** workers pull tasks dynamically — when worker 1 finishes task 0, it immediately grabs task 2. This keeps the pool full until all tasks are done.
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
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

  const workers = Array.from(
    { length: Math.min(limit, tasks.length) },
    () => worker()
  );
  await Promise.all(workers);
  return results;
}`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `// Interviewer: "How is this different from Promise.all?"
// Promise.all runs ALL tasks at once — no limit
// This keeps at most \`limit\` in flight

// Interviewer: "What if a task throws?"
async function worker() {
  while (nextIndex < tasks.length) {
    const i = nextIndex++;
    try {
      results[i] = await tasks[i]();
    } catch (err) {
      results[i] = { error: err }; // or fail fast with Promise.all
    }
  }
}

// Interviewer: "What if limit > tasks.length?"
// Math.min(limit, tasks.length) — don't spawn idle workers`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**Creating \`limit\` promises upfront with fixed task assignments** — that assigns tasks 0..limit-1 to workers permanently. Workers must **pull** from a shared queue/index.

**Using \`Promise.all(tasks.map(t => t()))\`** — that runs everything in parallel with no concurrency cap.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Use a Custom Runner',
      content: `
**Use existing libraries** (\`p-limit\`, \`async.mapLimit\`) in production — they're battle-tested.

**Use a job queue** (Bull, SQS) for server-side work that needs retries, persistence, and monitoring — not an in-memory worker pool.
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
    { label: 'Promise.all — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all' },
    { label: 'Using Promises — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
