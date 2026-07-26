import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt16AssertCalledWith: Lesson = {
  id: 'lesson-vt-16-assert-called-with',
  title: 'Assert Called With',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'intermediate',
  relatedChallengeIds: ['vt-16-assert-called-with'],
  estimatedMinutes: 10,
  concepts: ["mock assertions"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Assert Called With** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** mock assertions
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function assertCalledWith(mock, args) {
  const last = mock.calls[mock.calls.length - 1];
    if (!last || JSON.stringify(last) !== JSON.stringify(args)) throw new Error('Call args mismatch');
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
    id: 'mini-vt-16-assert-called-with',
    prompt: `Implement \`assertCalledWith\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function assertCalledWith(mock, args) {
  // Implement this function
  
}`,
      typescript: `function assertCalledWith(mock: { calls: unknown[][] }, args: unknown[]) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function assertCalledWith(mock, args) {
  const last = mock.calls[mock.calls.length - 1];
    if (!last || JSON.stringify(last) !== JSON.stringify(args)) throw new Error('Call args mismatch');
}`,
      typescript: `function assertCalledWith(mock: { calls: unknown[][] }, args: unknown[]) {
  const last = mock.calls[mock.calls.length - 1];
    if (!last || JSON.stringify(last) !== JSON.stringify(args)) throw new Error('Call args mismatch');
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'assertCalledWith');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('assertCalledWith', 'return Boolean(assertCalledWith({"calls":[[1,2]]}, [1,2]) === "ok")');
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
    { label: 'Assert Called With', url: 'https://developer.mozilla.org/' }
  ],
};
