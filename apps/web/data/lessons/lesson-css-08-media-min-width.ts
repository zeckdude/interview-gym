import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss08MediaMinWidth: Lesson = {
  id: 'lesson-css-08-media-min-width',
  title: 'Match min-width Media Query',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'easy',
  relatedChallengeIds: ['css-08-media-min-width'],
  estimatedMinutes: 10,
  concepts: ["media queries","responsive"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Match min-width Media Query** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** media queries, responsive
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function matchesMinWidth(viewport, minWidth) {
  return viewport >= minWidth;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **media queries**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-08-media-min-width',
    prompt: `Implement \`matchesMinWidth\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function matchesMinWidth(viewport, minWidth) {
  // Implement this function
  
}`,
      typescript: `function matchesMinWidth(viewport: number, minWidth: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function matchesMinWidth(viewport, minWidth) {
  return viewport >= minWidth;
}`,
      typescript: `function matchesMinWidth(viewport: number, minWidth: number) {
  return viewport >= minWidth;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'matchesMinWidth');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('matchesMinWidth', 'return Boolean(matchesMinWidth(900, 768) === true)');
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
    { label: 'Match min-width Media Query', url: 'https://developer.mozilla.org/' }
  ],
};
