import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss04HexToRgb: Lesson = {
  id: 'lesson-css-04-hex-to-rgb',
  title: 'Hex to RGB',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'easy',
  relatedChallengeIds: ['css-04-hex-to-rgb'],
  estimatedMinutes: 10,
  concepts: ["color","hex"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Hex to RGB** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** color, hex
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function hexToRgb(hex) {
  const clean = hex.replace('#', '');
    const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
    return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16) };
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
    id: 'mini-css-04-hex-to-rgb',
    prompt: `Implement \`hexToRgb\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function hexToRgb(hex) {
  // Implement this function
  
}`,
      typescript: `function hexToRgb(hex: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function hexToRgb(hex) {
  const clean = hex.replace('#', '');
    const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
    return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16) };
}`,
      typescript: `function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
    const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
    return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16) };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'hexToRgb');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('hexToRgb', 'return Boolean(JSON.stringify(hexToRgb("#ff8040")) === JSON.stringify({"r":255,"g":128,"b":64}))');
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
    { label: 'Hex to RGB', url: 'https://developer.mozilla.org/' }
  ],
};
