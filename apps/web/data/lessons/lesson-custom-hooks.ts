import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCustomHooks: Lesson = {
  id: 'lesson-custom-hooks',
  title: 'Building Custom React Hooks',
  category: 'fe',
  topLevel: 'fe',
  subcategory: null,
  difficulty: 'intermediate',
  relatedChallengeIds: ["fe-05-debounce-ui","fea-02-custom-hook"],
  estimatedMinutes: 11,
  concepts: ["custom hooks","composition"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Building Custom React Hooks** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** custom hooks, composition
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createToggle(initial = false) {
  let on = initial;
  return { isOn: () => on, toggle: () => { on = !on; } };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **custom hooks**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-custom-hooks',
    prompt: `Build toggle logic — createToggle() returns isOn() and toggle().`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function createToggle(initial = false) {
  let on = initial;
  return { isOn: () => on, toggle: () => { on = !on; } };
}`,
      typescript: `function createToggle(initial = false) {
  let on = initial;
  return { isOn: () => on, toggle: () => { on = !on; } };
}`,
    },
    solution: {
      javascript: `function createToggle(initial = false) {
  let on = initial;
  return { isOn: () => on, toggle: () => { on = !on; } };
}`,
      typescript: `function createToggle(initial = false) {
  let on = initial;
  return { isOn: () => on, toggle: () => { on = !on; } };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createToggle');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createToggle', 'return Boolean((() => { const t = createToggle(); t.toggle(); return t.isOn() === true; })())');
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
    { label: 'Custom Hooks', url: 'https://react.dev/learn/reusing-logic-with-custom-hooks' }
  ],
};
