import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss09ContrastRatio: Lesson = {
  id: 'lesson-css-09-contrast-ratio',
  title: 'Contrast Ratio',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'easy',
  relatedChallengeIds: ['css-09-contrast-ratio'],
  estimatedMinutes: 10,
  concepts: ["accessibility","WCAG"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Contrast Ratio** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** accessibility, WCAG
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **accessibility**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-09-contrast-ratio',
    prompt: `Implement \`contrastRatio\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function contrastRatio(l1, l2) {
  // Implement this function
  
}`,
      typescript: `function contrastRatio(l1: number, l2: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}`,
      typescript: `function contrastRatio(l1: number, l2: number) {
  const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'contrastRatio');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('contrastRatio', 'return Boolean(contrastRatio(1, 0.2) === 4.25)');
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
    { label: 'Contrast Ratio', url: 'https://developer.mozilla.org/' }
  ],
};
