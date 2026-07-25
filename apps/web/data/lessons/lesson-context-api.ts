import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonContextApi: Lesson = {
  id: 'lesson-context-api',
  title: 'React Context — Avoiding Prop Drilling',
  category: 'fe',
  difficulty: 'intermediate',
  relatedChallengeIds: ["fea-03-context-api","fe-06-virtual-list"],
  estimatedMinutes: 10,
  concepts: ["Context","Provider"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**React Context** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** Context, Provider
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createStore(initial) {
  let value = initial;
  return { get: () => value, set: (v) => { value = v; } };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **Context**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-context-api',
    prompt: `Implement a simple store with get() and set(v).`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function createStore(initial) {
  let value = initial;
  return { get: () => value, set: (v) => { value = v; } };
}`,
      typescript: `function createStore<T>(initial: T) {
  let value = initial;
  return { get: () => value, set: (v: T) => { value = v; } };
}`,
    },
    solution: {
      javascript: `function createStore(initial) {
  let value = initial;
  return { get: () => value, set: (v) => { value = v; } };
}`,
      typescript: `function createStore<T>(initial: T) {
  let value = initial;
  return { get: () => value, set: (v: T) => { value = v; } };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createStore');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createStore', 'return Boolean((() => { const s = createStore(1); s.set(5); return s.get() === 5; })())');
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
    { label: 'React Context', url: 'https://react.dev/learn/passing-data-deeply-with-context' }
  ],
};
