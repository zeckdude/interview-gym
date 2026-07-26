import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss30AspectRatioBox: Lesson = {
  id: 'lesson-css-30-aspect-ratio-box',
  title: 'Aspect Ratio Height',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'advanced',
  relatedChallengeIds: ['css-30-aspect-ratio-box'],
  estimatedMinutes: 10,
  concepts: ["layout"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Aspect Ratio Height** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** layout
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function heightFromAspectRatio(width, ratio) {
  return width / ratio;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **layout**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-30-aspect-ratio-box',
    prompt: `Implement \`heightFromAspectRatio\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function heightFromAspectRatio(width, ratio) {
  // Implement this function
  
}`,
      typescript: `function heightFromAspectRatio(width: number, ratio: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function heightFromAspectRatio(width, ratio) {
  return width / ratio;
}`,
      typescript: `function heightFromAspectRatio(width: number, ratio: number) {
  return width / ratio;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'heightFromAspectRatio');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('heightFromAspectRatio', 'return Boolean(heightFromAspectRatio(160, 1.7777777777777777) === 90)');
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
    { label: 'Aspect Ratio Height', url: 'https://developer.mozilla.org/' }
  ],
};
