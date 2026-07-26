import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonReactHooks: Lesson = {
  id: 'lesson-react-hooks',
  title: 'React Hooks Deep Dive — useState, useEffect, useRef',
  category: 'fe',
  topLevel: 'fe',
  subcategory: null,
  difficulty: 'easy',
  relatedChallengeIds: ["fe-01-closure-counter","fe-02-event-delegation","fe-03-promise-all","fe-04-deep-clone","fe-05-debounce-ui","fe-06-virtual-list"],
  estimatedMinutes: 15,
  concepts: ["useState","useEffect","useRef"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**React Hooks Deep Dive** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** useState, useEffect, useRef
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function useCounterLogic(initial) {
  let count = initial;
  return { get count() { return count; }, increment() { count++; } };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **useState**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-react-hooks',
    prompt: `Simulate useState — useCounterLogic(initial) returns count and increment().`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function useCounterLogic(initial) {
  let count = initial;
  return { get count() { return count; }, increment() { count++; } };
}`,
      typescript: `function useCounterLogic(initial: number) {
  let count = initial;
  return { get count() { return count; }, increment() { count++; } };
}`,
    },
    solution: {
      javascript: `function useCounterLogic(initial) {
  let count = initial;
  return { get count() { return count; }, increment() { count++; } };
}`,
      typescript: `function useCounterLogic(initial: number) {
  let count = initial;
  return { get count() { return count; }, increment() { count++; } };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'useCounterLogic');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('useCounterLogic', 'return Boolean((() => { const c = useCounterLogic(0); c.increment(); c.increment(); return c.count === 2; })())');
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
    { label: 'React Hooks', url: 'https://react.dev/reference/react' }
  ],
};
