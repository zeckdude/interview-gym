import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe01ClosureCounter: Lesson = {
  id: 'lesson-fe-01-closure-counter',
  title: 'Closure Counter',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'intermediate',
  sequenceOrder: 19,
  mostAsked: true,
  relatedChallengeIds: ['fe-01-closure-counter'],
  estimatedMinutes: 14,
  concepts: ['closures', 'private state', 'factory functions'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Closures** are the #1 JavaScript interview topic. A closure counter proves you understand private state without classes — the inner function "closes over" \`count\` even after the outer function returns.
      `,
    },
    {
      type: 'explanation',
      title: 'How Closures Work',
      content: `
When \`createCounter\` runs, it creates a \`count\` variable. The returned object's methods reference that variable — they carry it in a "backpack" forever.

Each call to \`createCounter()\` gets its **own** \`count\` — separate instances don't share state.
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `function createCounter(initial = 0) {
  let count = initial;
  return {
    increment() { count++; },
    decrement() { count--; },
    reset() { count = initial; },
    getCount() { return count; },
  };
}`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `const a = createCounter(0);
const b = createCounter(100);
a.increment();
a.getCount(); // 1
b.getCount(); // 100 — independent closures`,
    },
    {
      type: 'gotcha',
      title: '⚠️ The Loop Closure Gotcha',
      content: `
**\`var\` in loops** — all callbacks share one \`i\`. Use \`let\` for block-scoped bindings per iteration.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Use Closures for State',
      content: `
**React components** — use \`useState\`, not manual closure counters. Closures shine in vanilla JS utilities and module patterns.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fe-01-closure-counter',
    prompt: `Implement \`createCounter(initial?)\` — closure-based counter with increment, decrement, reset, getCount.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function createCounter(initial = 0) {
  // Implement this function
  
}`,
      typescript: `function createCounter(initial = 0) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function createCounter(initial = 0) {
  let count = initial;
  return {
    increment() { count++; },
    decrement() { count--; },
    reset() { count = initial; },
    getCount() { return count; },
  };
}`,
      typescript: `function createCounter(initial = 0) {
  let count = initial;
  return {
    increment() { count++; },
    decrement() { count--; },
    reset() { count = initial; },
    getCount() { return count; },
  };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createCounter');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createCounter', `return Boolean((function () {
          const c = createCounter(10);
          c.increment(); c.increment(); c.decrement();
          return c.getCount() === 11 && (function () {
            const d = createCounter(0); d.increment(); return d.getCount() === 1;
          })();
        })());`);
        return testRunner(result.value)
          ? { passed: true, feedback: 'Perfect! All tests passed. ✓' }
          : { passed: false, feedback: 'Not quite — check increment, decrement, and independent instances.' };
      } catch (e) {
        return { passed: false, feedback: `Error running tests: ${e instanceof Error ? e.message : String(e)}` };
      }
    },
  },
  mdnLinks: [
    { label: 'Closures — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
