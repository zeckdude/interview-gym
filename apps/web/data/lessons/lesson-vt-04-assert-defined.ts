import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt04AssertDefined: Lesson = {
  id: 'lesson-vt-04-assert-defined',
  title: 'Assert Defined',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'easy',
  relatedChallengeIds: ['vt-04-assert-defined'],
  estimatedMinutes: 10,
  concepts: ["narrowing"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Assert Defined** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** narrowing
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function assertDefined(value) {
  if (value === undefined) throw new Error('Expected defined value');
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **narrowing**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-04-assert-defined',
    prompt: `Implement \`assertDefined\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function assertDefined(value) {
  // Implement this function
  
}`,
      typescript: `function assertDefined(value: unknown) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function assertDefined(value) {
  if (value === undefined) throw new Error('Expected defined value');
}`,
      typescript: `function assertDefined(value: unknown) {
  if (value === undefined) throw new Error('Expected defined value');
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'assertDefined');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('assertDefined', 'return Boolean(assertDefined(0) === "ok")');
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
    { label: 'Assert Defined', url: 'https://developer.mozilla.org/' }
  ],
};
