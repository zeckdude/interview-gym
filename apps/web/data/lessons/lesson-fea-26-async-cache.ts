import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFea26AsyncCache: Lesson = {
  id: 'lesson-fea-26-async-cache',
  title: 'Async Cache Factory',
  category: 'fe-advanced',
  topLevel: 'fe',
  subcategory: 'react',
  difficulty: 'advanced',
  relatedChallengeIds: ['fea-26-async-cache'],
  estimatedMinutes: 10,
  concepts: ["caching","async","factories"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Async Cache Factory** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** caching, async, factories
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createAsyncCache() {
  const cache = new Map();
    return {
      async get(key, loader) {
        if (cache.has(key)) return cache.get(key);
        const value = await loader();
        cache.set(key, value);
        return value;
      },
      has(key) { return cache.has(key); },
      clear() { cache.clear(); },
    };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **caching**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fea-26-async-cache',
    prompt: `Implement \`createAsyncCache()\` — memoize async loader results by string key.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function createAsyncCache() {
  // Implement this function
  
}`,
      typescript: `function createAsyncCache() {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function createAsyncCache() {
  const cache = new Map();
    return {
      async get(key, loader) {
        if (cache.has(key)) return cache.get(key);
        const value = await loader();
        cache.set(key, value);
        return value;
      },
      has(key) { return cache.has(key); },
      clear() { cache.clear(); },
    };
}`,
      typescript: `function createAsyncCache() {
  const cache = new Map();
    return {
      async get(key, loader) {
        if (cache.has(key)) return cache.get(key);
        const value = await loader();
        cache.set(key, value);
        return value;
      },
      has(key) { return cache.has(key); },
      clear() { cache.clear(); },
    };
}`,
    },
    validate: async (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createAsyncCache');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createAsyncCache', `return ((async () => {
                  const cache = createAsyncCache();
                  let loads = 0;
                  const loader = async () => { loads += 1; return 'ok'; };
                  await cache.get('a', loader);
                  await cache.get('a', loader);
                  return loads === 1 && cache.has('a');
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
    { label: 'Async Cache Factory', url: 'https://developer.mozilla.org/' }
  ],
};
