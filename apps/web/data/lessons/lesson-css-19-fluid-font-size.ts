import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss19FluidFontSize: Lesson = {
  id: 'lesson-css-19-fluid-font-size',
  title: 'Fluid Font Size',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'intermediate',
  relatedChallengeIds: ['css-19-fluid-font-size'],
  estimatedMinutes: 10,
  concepts: ["clamp","typography"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Fluid Font Size** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** clamp, typography
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function fluidFontSize(min, max, minVw, maxVw, viewport) {
  const ratio = (viewport - minVw) / (maxVw - minVw);
    const clamped = Math.min(1, Math.max(0, ratio));
    return min + (max - min) * clamped;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **clamp**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-19-fluid-font-size',
    prompt: `Implement \`fluidFontSize\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function fluidFontSize(min, max, minVw, maxVw, viewport) {
  // Implement this function
  
}`,
      typescript: `function fluidFontSize(min: number, max: number, minVw: number, maxVw: number, viewport: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function fluidFontSize(min, max, minVw, maxVw, viewport) {
  const ratio = (viewport - minVw) / (maxVw - minVw);
    const clamped = Math.min(1, Math.max(0, ratio));
    return min + (max - min) * clamped;
}`,
      typescript: `function fluidFontSize(min: number, max: number, minVw: number, maxVw: number, viewport: number) {
  const ratio = (viewport - minVw) / (maxVw - minVw);
    const clamped = Math.min(1, Math.max(0, ratio));
    return min + (max - min) * clamped;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'fluidFontSize');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('fluidFontSize', 'return Boolean(fluidFontSize(16, 24, 320, 1280, 800) === 20)');
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
    { label: 'Fluid Font Size', url: 'https://developer.mozilla.org/' }
  ],
};
