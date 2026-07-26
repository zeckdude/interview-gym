import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss18BoxModelTotal: Lesson = {
  id: 'lesson-css-18-box-model-total',
  title: 'Total Box Size',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'intermediate',
  relatedChallengeIds: ['css-18-box-model-total'],
  estimatedMinutes: 10,
  concepts: ["box model"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Total Box Size** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** box model
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function totalBoxSize(content, padding, border, margin) {
  return content + padding * 2 + border * 2 + margin * 2;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **box model**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-18-box-model-total',
    prompt: `Implement \`totalBoxSize\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function totalBoxSize(content, padding, border, margin) {
  // Implement this function
  
}`,
      typescript: `function totalBoxSize(content: number, padding: number, border: number, margin: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function totalBoxSize(content, padding, border, margin) {
  return content + padding * 2 + border * 2 + margin * 2;
}`,
      typescript: `function totalBoxSize(content: number, padding: number, border: number, margin: number) {
  return content + padding * 2 + border * 2 + margin * 2;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'totalBoxSize');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('totalBoxSize', 'return Boolean(totalBoxSize(100, 8, 1, 16) === 150)');
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
    { label: 'Total Box Size', url: 'https://developer.mozilla.org/' }
  ],
};
