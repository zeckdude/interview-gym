import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss16SpacingScale: Lesson = {
  id: 'lesson-css-16-spacing-scale',
  title: 'Build Spacing Scale',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'intermediate',
  relatedChallengeIds: ['css-16-spacing-scale'],
  estimatedMinutes: 10,
  concepts: ["design systems"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Build Spacing Scale** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** design systems
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function spacingScale(base, steps) {
  return Array.from({ length: steps }, (_, i) => (i + 1) * base);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **design systems**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-16-spacing-scale',
    prompt: `Implement \`spacingScale\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function spacingScale(base, steps) {
  // Implement this function
  
}`,
      typescript: `function spacingScale(base: number, steps: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function spacingScale(base, steps) {
  return Array.from({ length: steps }, (_, i) => (i + 1) * base);
}`,
      typescript: `function spacingScale(base: number, steps: number) {
  return Array.from({ length: steps }, (_, i) => (i + 1) * base);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'spacingScale');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('spacingScale', 'return Boolean(JSON.stringify(spacingScale(4, 3)) === JSON.stringify([4,8,12]))');
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
    { label: 'Build Spacing Scale', url: 'https://developer.mozilla.org/' }
  ],
};
