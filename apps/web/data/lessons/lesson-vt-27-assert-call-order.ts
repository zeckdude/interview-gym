import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt27AssertCallOrder: Lesson = {
  id: 'lesson-vt-27-assert-call-order',
  title: 'Assert Call Order',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'advanced',
  relatedChallengeIds: ['vt-27-assert-call-order'],
  estimatedMinutes: 10,
  concepts: ["spies"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Assert Call Order** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** spies
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function assertCallOrder(mock, order) {
  return JSON.stringify(mock.calls.map((c) => c[0])) === JSON.stringify(order);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **spies**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-27-assert-call-order',
    prompt: `Implement \`assertCallOrder\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function assertCallOrder(mock, order) {
  // Implement this function
  
}`,
      typescript: `function assertCallOrder(mock: { calls: unknown[][] }, order: string[]) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function assertCallOrder(mock, order) {
  return JSON.stringify(mock.calls.map((c) => c[0])) === JSON.stringify(order);
}`,
      typescript: `function assertCallOrder(mock: { calls: unknown[][] }, order: string[]) {
  return JSON.stringify(mock.calls.map((c) => c[0])) === JSON.stringify(order);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'assertCallOrder');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('assertCallOrder', 'return Boolean(assertCallOrder({"calls":[["a"],["b"]]}, ["a","b"]) === true)');
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
    { label: 'Assert Call Order', url: 'https://developer.mozilla.org/' }
  ],
};
