import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFea21ToggleState: Lesson = {
  id: 'lesson-fea-21-toggle-state',
  title: 'Toggle State Factory',
  category: 'fe-advanced',
  topLevel: 'fe',
  subcategory: 'react',
  difficulty: 'easy',
  relatedChallengeIds: ['fea-21-toggle-state'],
  estimatedMinutes: 10,
  concepts: ["state","factories","closures"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Toggle State Factory** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** state, factories, closures
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createToggleState(initial = false) {
  let value = initial;
    return {
      get() { return value; },
      toggle() { value = !value; },
      set(next) { value = Boolean(next); },
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
    id: 'mini-fea-21-toggle-state',
    prompt: `Implement \`createToggleState(initial?)\` — a small state container with get, toggle, and set (not React hooks).`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function createToggleState(initial = false) {
  // Implement this function
  
}`,
      typescript: `function createToggleState(initial?: boolean) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function createToggleState(initial = false) {
  let value = initial;
    return {
      get() { return value; },
      toggle() { value = !value; },
      set(next) { value = Boolean(next); },
    };
}`,
      typescript: `function createToggleState(initial?: boolean) {
  let value = initial;
    return {
      get() { return value; },
      toggle() { value = !value; },
      set(next) { value = Boolean(next); },
    };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createToggleState');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createToggleState', `return Boolean((function () {
                  const toggle = createToggleState(false);
                  toggle.toggle();
                  return toggle.get() === true;
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
    { label: 'Toggle State Factory', url: 'https://developer.mozilla.org/' }
  ],
};
