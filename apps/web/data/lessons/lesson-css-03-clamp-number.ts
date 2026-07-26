import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss03ClampNumber: Lesson = {
  id: 'lesson-css-03-clamp-number',
  title: 'CSS clamp Helper',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'easy',
  relatedChallengeIds: ['css-03-clamp-number'],
  estimatedMinutes: 10,
  concepts: ["min","max","clamp"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**CSS clamp Helper** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** min, max, clamp
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **min**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-03-clamp-number',
    prompt: `Implement \`clamp\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function clamp(value, min, max) {
  // Implement this function
  
}`,
      typescript: `function clamp(value: number, min: number, max: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}`,
      typescript: `function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'clamp');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('clamp', 'return Boolean(clamp(20, 0, 10) === 10)');
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
    { label: 'CSS clamp Helper', url: 'https://developer.mozilla.org/' }
  ],
};
