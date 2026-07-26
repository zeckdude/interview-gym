import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss24ContainerQueryMatch: Lesson = {
  id: 'lesson-css-24-container-query-match',
  title: 'Container Query Match',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'advanced',
  relatedChallengeIds: ['css-24-container-query-match'],
  estimatedMinutes: 10,
  concepts: ["container queries"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Container Query Match** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** container queries
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function matchesContainer(size, minSize) {
  return size >= minSize;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **container queries**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-24-container-query-match',
    prompt: `Implement \`matchesContainer\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function matchesContainer(size, minSize) {
  // Implement this function
  
}`,
      typescript: `function matchesContainer(size: number, minSize: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function matchesContainer(size, minSize) {
  return size >= minSize;
}`,
      typescript: `function matchesContainer(size: number, minSize: number) {
  return size >= minSize;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'matchesContainer');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('matchesContainer', 'return Boolean(matchesContainer(520, 480) === true)');
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
    { label: 'Container Query Match', url: 'https://developer.mozilla.org/' }
  ],
};
