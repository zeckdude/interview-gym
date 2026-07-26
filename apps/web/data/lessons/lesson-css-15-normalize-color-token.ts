import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss15NormalizeColorToken: Lesson = {
  id: 'lesson-css-15-normalize-color-token',
  title: 'Normalize Color Token',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'intermediate',
  relatedChallengeIds: ['css-15-normalize-color-token'],
  estimatedMinutes: 10,
  concepts: ["colors"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Normalize Color Token** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** colors
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function normalizeColor(value) {
  const map = { black: '#000000', white: '#ffffff' };
    return map[value.toLowerCase()] ?? value;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **colors**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-15-normalize-color-token',
    prompt: `Implement \`normalizeColor\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function normalizeColor(value) {
  // Implement this function
  
}`,
      typescript: `function normalizeColor(value: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function normalizeColor(value) {
  const map = { black: '#000000', white: '#ffffff' };
    return map[value.toLowerCase()] ?? value;
}`,
      typescript: `function normalizeColor(value: string) {
  const map = { black: '#000000', white: '#ffffff' };
    return map[value.toLowerCase()] ?? value;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'normalizeColor');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('normalizeColor', 'return Boolean(normalizeColor("black") === "#000000")');
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
    { label: 'Normalize Color Token', url: 'https://developer.mozilla.org/' }
  ],
};
