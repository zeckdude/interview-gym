import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss02PxToRem: Lesson = {
  id: 'lesson-css-02-px-to-rem',
  title: 'Convert px to rem',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'easy',
  relatedChallengeIds: ['css-02-px-to-rem'],
  estimatedMinutes: 10,
  concepts: ["rem","typography"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Convert px to rem** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** rem, typography
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function pxToRem(px, base = 16) {
  return px / base;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **rem**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-02-px-to-rem',
    prompt: `Implement \`pxToRem\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function pxToRem(px, base = 16) {
  // Implement this function
  
}`,
      typescript: `function pxToRem(px: number, base = 16) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function pxToRem(px, base = 16) {
  return px / base;
}`,
      typescript: `function pxToRem(px: number, base = 16) {
  return px / base;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'pxToRem');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('pxToRem', 'return Boolean(pxToRem(32, 16) === 2)');
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
    { label: 'Convert px to rem', url: 'https://developer.mozilla.org/' }
  ],
};
