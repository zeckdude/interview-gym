import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe03PromiseAll: Lesson = {
  id: 'lesson-fe-03-promise-all',
  title: 'Implement Promise.all',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'intermediate',
  sequenceOrder: 24,
  mostAsked: true,
  relatedChallengeIds: ['fe-03-promise-all'],
  estimatedMinutes: 15,
  concepts: ['Promises', 'async', 'Promise.all'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
Fetching user + posts + comments in parallel? **Promise.all** runs them concurrently and waits for all. Implementing it from scratch is a top-tier async interview question — tests Promises, error propagation, and result ordering.
      `,
    },
    {
      type: 'explanation',
      title: 'How Promise.all Works',
      content: `
Returns a single Promise that:

- Resolves to an **array of results in input order** (not completion order)
- Rejects immediately if **any** input rejects
- Resolves to \`[]\` for empty input

Wrap each item with \`Promise.resolve()\` to handle non-promise values.
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) { resolve([]); return; }
    const results = new Array(promises.length);
    let remaining = promises.length;
    promises.forEach((p, i) => {
      Promise.resolve(p).then((value) => {
        results[i] = value;
        remaining--;
        if (remaining === 0) resolve(results);
      }).catch(reject);
    });
  });
}`,
    },
    {
      type: 'explanation',
      title: 'Interview Variation',
      content: `
**Follow-up questions interviewers ask:**

- "What about Promise.allSettled?" — waits for all, never rejects early
- "Does order of results match order of inputs?" — yes, index \`i\` is preserved
- "What if one promise never resolves?" — the whole thing hangs (mention timeout patterns)
      `,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**Pushing results with \`push\`** — completion order ≠ input order. Must assign \`results[i] = value\` by index.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Use Promise.all',
      content: `
**When one failure shouldn't cancel others** — use \`Promise.allSettled\`.

**When you need results as they arrive** — use streaming or \`Promise.race\` patterns.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fe-03-promise-all',
    prompt: `Implement \`promiseAll(promises)\` — resolves when all complete, preserves order, rejects on first failure.`,
    timeLimitSeconds: 150,
    starterCode: {
      javascript: `function promiseAll(promises) {
  // Implement this function
  
}`,
      typescript: `function promiseAll<T>(promises: Array<T | Promise<T>>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) { resolve([]); return; }
    const results = new Array(promises.length);
    let remaining = promises.length;
    promises.forEach((p, i) => {
      Promise.resolve(p).then((value) => {
        results[i] = value;
        remaining--;
        if (remaining === 0) resolve(results);
      }).catch(reject);
    });
  });
}`,
      typescript: `function promiseAll<T>(promises: Array<T | Promise<T>>) {
  return new Promise<T[]>((resolve, reject) => {
    if (promises.length === 0) { resolve([]); return; }
    const results = new Array<T>(promises.length);
    let remaining = promises.length;
    promises.forEach((p, i) => {
      Promise.resolve(p).then((value) => {
        results[i] = value;
        remaining--;
        if (remaining === 0) resolve(results);
      }).catch(reject);
    });
  });
}`,
    },
    validate: async (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'promiseAll');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('promiseAll', `return ((async () => {
          const r = await promiseAll([Promise.resolve(1), Promise.resolve(2), 3]);
          return JSON.stringify(r) === JSON.stringify([1, 2, 3]);
        })());`);
        const ok = Boolean(await testRunner(result.value));
        return ok
          ? { passed: true, feedback: 'Perfect! All tests passed. ✓' }
          : { passed: false, feedback: 'Not quite — check order preservation and empty input.' };
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
