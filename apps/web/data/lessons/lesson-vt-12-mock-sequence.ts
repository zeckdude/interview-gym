import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt12MockSequence: Lesson = {
  id: 'lesson-vt-12-mock-sequence',
  title: 'Mock Return Sequence',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'intermediate',
  relatedChallengeIds: ['vt-12-mock-sequence'],
  estimatedMinutes: 10,
  concepts: ["mocks"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Mock Return Sequence** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** mocks
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function mockSequence(values) {
  let i = 0;
    return () => values[i++];
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **mocks**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-12-mock-sequence',
    prompt: `Implement \`mockSequence\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function mockSequence(values) {
  // Implement this function
  
}`,
      typescript: `function mockSequence(values) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function mockSequence(values) {
  let i = 0;
    return () => values[i++];
}`,
      typescript: `function mockSequence(values) {
  let i = 0;
    return () => values[i++];
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'mockSequence');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('mockSequence', 'return Boolean((() => { const m = mockSequence([1,2]); return m() === 1 && m() === 2; })())');
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
    { label: 'Mock Return Sequence', url: 'https://developer.mozilla.org/' }
  ],
};
