import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss05RgbToHex: Lesson = {
  id: 'lesson-css-05-rgb-to-hex',
  title: 'RGB to Hex',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'easy',
  relatedChallengeIds: ['css-05-rgb-to-hex'],
  estimatedMinutes: 10,
  concepts: ["color"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**RGB to Hex** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** color
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function rgbToHex(r, g, b) {
  const toHex = (n) => n.toString(16).padStart(2, '0');
    return '#' + toHex(r) + toHex(g) + toHex(b);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **color**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-05-rgb-to-hex',
    prompt: `Implement \`rgbToHex\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function rgbToHex(r, g, b) {
  // Implement this function
  
}`,
      typescript: `function rgbToHex(r: number, g: number, b: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function rgbToHex(r, g, b) {
  const toHex = (n) => n.toString(16).padStart(2, '0');
    return '#' + toHex(r) + toHex(g) + toHex(b);
}`,
      typescript: `function rgbToHex(r: number, g: number, b: number) {
  const toHex = (n) => n.toString(16).padStart(2, '0');
    return '#' + toHex(r) + toHex(g) + toHex(b);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'rgbToHex');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('rgbToHex', 'return Boolean(rgbToHex(255, 128, 64) === "#ff8040")');
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
    { label: 'RGB to Hex', url: 'https://developer.mozilla.org/' }
  ],
};
