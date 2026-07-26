import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs29LruCache: Lesson = {
  id: 'lesson-ts-29-lru-cache',
  title: 'LRU Cache Factory',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'advanced',
  relatedChallengeIds: ['ts-29-lru-cache'],
  estimatedMinutes: 10,
  concepts: ["LRU","Map"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**LRU Cache Factory** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** LRU, Map
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createLruCache(capacity) {
  const map = new Map();
    return {
      get(key) {
        if (!map.has(key)) return undefined;
        const value = map.get(key);
        map.delete(key);
        map.set(key, value);
        return value;
      },
      set(key, value) {
        if (map.has(key)) map.delete(key);
        map.set(key, value);
        if (map.size > capacity) {
          const oldest = map.keys().next().value;
          map.delete(oldest);
        }
      },
    };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **LRU**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-29-lru-cache',
    prompt: `Implement \`createLruCache\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function createLruCache(capacity) {
  // Implement this function
  
}`,
      typescript: `function createLruCache(capacity: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function createLruCache(capacity) {
  const map = new Map();
    return {
      get(key) {
        if (!map.has(key)) return undefined;
        const value = map.get(key);
        map.delete(key);
        map.set(key, value);
        return value;
      },
      set(key, value) {
        if (map.has(key)) map.delete(key);
        map.set(key, value);
        if (map.size > capacity) {
          const oldest = map.keys().next().value;
          map.delete(oldest);
        }
      },
    };
}`,
      typescript: `function createLruCache(capacity: number) {
  const map = new Map();
    return {
      get(key) {
        if (!map.has(key)) return undefined;
        const value = map.get(key);
        map.delete(key);
        map.set(key, value);
        return value;
      },
      set(key, value) {
        if (map.has(key)) map.delete(key);
        map.set(key, value);
        if (map.size > capacity) {
          const oldest = map.keys().next().value;
          map.delete(oldest);
        }
      },
    };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createLruCache');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createLruCache', 'return Boolean((() => { const cache = createLruCache(2); cache.set(\'a\', 1); cache.set(\'b\', 2); cache.get(\'a\'); cache.set(\'c\', 3); return cache.get(\'b\') === undefined; })())');
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
    { label: 'LRU Cache Factory', url: 'https://developer.mozilla.org/' }
  ],
};
