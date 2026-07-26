import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt01AssertEqual: Lesson = {
  id: 'lesson-vt-01-assert-equal',
  title: 'Assert Equal',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'easy',
  relatedChallengeIds: ['vt-01-assert-equal'],
  estimatedMinutes: 10,
  concepts: ["assertions"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Assert Equal** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** assertions
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function assertEqual(actual, expected) {
  if (actual !== expected) throw new Error('Expected ' + expected + ' but got ' + actual);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **assertions**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-01-assert-equal',
    prompt: `Implement \`assertEqual\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function assertEqual(actual, expected) {
  // Implement this function
  
}`,
      typescript: `function assertEqual(actual: unknown, expected: unknown) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function assertEqual(actual, expected) {
  if (actual !== expected) throw new Error('Expected ' + expected + ' but got ' + actual);
}`,
      typescript: `function assertEqual(actual: unknown, expected: unknown) {
  if (actual !== expected) throw new Error('Expected ' + expected + ' but got ' + actual);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'assertEqual');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('assertEqual', 'return Boolean(assertEqual(1, 1) === "ok")');
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
    { label: 'Assert Equal', url: 'https://developer.mozilla.org/' }
  ],
};
