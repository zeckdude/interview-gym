import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonMemoization: Lesson = {
  id: 'lesson-memoization',
  title: 'Memoization and Caching',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'intermediate',
  relatedChallengeIds: ["be-11-cache-lru","be-04-debounce"],
  estimatedMinutes: 10,
  concepts: ["memoization","cache"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Memoization and Caching** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** memoization, cache
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) return cache[key];
    return (cache[key] = fn(...args));
  };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **memoization**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-memoization',
    prompt: `Implement memoize(fn) — caches results by arguments.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function memoize(fn) {
  const cache = {};
  return function(...args) { };
}`,
      typescript: `function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const cache: Record<string, unknown> = {};
  return function(...args: unknown[]) { } as T;
}`,
    },
    solution: {
      javascript: `function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) return cache[key];
    return (cache[key] = fn(...args));
  };
}`,
      typescript: `function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const cache: Record<string, unknown> = {};
  return function(...args: unknown[]) {
    const key = JSON.stringify(args);
    if (key in cache) return cache[key];
    return (cache[key] = fn(...args));
  } as T;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'memoize');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('memoize', 'return Boolean((() => { let c = 0; const f = memoize((n) => { c++; return n * 2; }); f(3); f(3); f(4); return c === 2; })())');
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
    { label: 'Memoization — MDN', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Memoization' }
  ],
};
