import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt17AssertCallCount: Lesson = {
  id: 'lesson-vt-17-assert-call-count',
  title: 'Assert Call Count',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'intermediate',
  relatedChallengeIds: ['vt-17-assert-call-count'],
  estimatedMinutes: 10,
  concepts: ["mock assertions"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Assert Call Count** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** mock assertions
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function assertCallCount(mock, count) {
  if (mock.calls.length !== count) throw new Error('Expected ' + count + ' calls');
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **mock assertions**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-17-assert-call-count',
    prompt: `Implement \`assertCallCount\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function assertCallCount(mock, count) {
  // Implement this function
  
}`,
      typescript: `function assertCallCount(mock: { calls: unknown[][] }, count: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function assertCallCount(mock, count) {
  if (mock.calls.length !== count) throw new Error('Expected ' + count + ' calls');
}`,
      typescript: `function assertCallCount(mock: { calls: unknown[][] }, count: number) {
  if (mock.calls.length !== count) throw new Error('Expected ' + count + ' calls');
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'assertCallCount');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('assertCallCount', 'return Boolean(assertCallCount({"calls":[[],[]]}, 2) === "ok")');
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
    { label: 'Assert Call Count', url: 'https://developer.mozilla.org/' }
  ],
};
