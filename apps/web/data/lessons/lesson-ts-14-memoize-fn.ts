import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs14MemoizeFn: Lesson = {
  id: 'lesson-ts-14-memoize-fn',
  title: 'Memoize a Function',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ts-14-memoize-fn'],
  estimatedMinutes: 10,
  concepts: ["memoization","cache"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Memoize a Function** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** memoization, cache
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function memoize(fn) {
  const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) return cache.get(key);
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **memoization**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-14-memoize-fn',
    prompt: `Implement \`memoize\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function memoize(fn) {
  // Implement this function
  
}`,
      typescript: `function memoize(fn: (...args: number[]) => number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function memoize(fn) {
  const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) return cache.get(key);
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
}`,
      typescript: `function memoize(fn: (...args: number[]) => number) {
  const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) return cache.get(key);
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'memoize');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('memoize', 'return Boolean((() => { let c = 0; const f = memoize((n) => { c++; return n * 2; }); f(5); f(5); return f(5) === 10 && c === 1; })())');
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
    { label: 'Memoize a Function', url: 'https://developer.mozilla.org/' }
  ],
};
