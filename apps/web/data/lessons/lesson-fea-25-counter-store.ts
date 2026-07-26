import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFea25CounterStore: Lesson = {
  id: 'lesson-fea-25-counter-store',
  title: 'Counter Store Factory',
  category: 'fe-advanced',
  topLevel: 'fe',
  subcategory: 'react',
  difficulty: 'easy',
  relatedChallengeIds: ['fea-25-counter-store'],
  estimatedMinutes: 10,
  concepts: ["state","factories","reducers"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Counter Store Factory** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** state, factories, reducers
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createCounterStore(initial = 0) {
  let count = initial;
    return {
      getCount() { return count; },
      increment(step = 1) { count += step; },
      decrement(step = 1) { count -= step; },
      reset() { count = initial; },
    };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **state**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fea-25-counter-store',
    prompt: `Implement \`createCounterStore(initial?)\` — a minimal counter with increment, decrement, reset.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function createCounterStore(initial = 0) {
  // Implement this function
  
}`,
      typescript: `function createCounterStore(initial?: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function createCounterStore(initial = 0) {
  let count = initial;
    return {
      getCount() { return count; },
      increment(step = 1) { count += step; },
      decrement(step = 1) { count -= step; },
      reset() { count = initial; },
    };
}`,
      typescript: `function createCounterStore(initial?: number) {
  let count = initial;
    return {
      getCount() { return count; },
      increment(step = 1) { count += step; },
      decrement(step = 1) { count -= step; },
      reset() { count = initial; },
    };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createCounterStore');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createCounterStore', `return Boolean((function () {
                  const store = createCounterStore(10);
                  store.increment(5);
                  store.decrement(3);
                  return store.getCount() === 12;
                })());`);
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
    { label: 'Counter Store Factory', url: 'https://developer.mozilla.org/' }
  ],
};
