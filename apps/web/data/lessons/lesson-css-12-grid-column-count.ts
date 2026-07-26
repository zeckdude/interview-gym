import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss12GridColumnCount: Lesson = {
  id: 'lesson-css-12-grid-column-count',
  title: 'Count Grid Columns',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'intermediate',
  relatedChallengeIds: ['css-12-grid-column-count'],
  estimatedMinutes: 10,
  concepts: ["grid"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Count Grid Columns** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** grid
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function gridColumnCount(template) {
  return template.trim().split(/\\s+/).length;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **grid**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-12-grid-column-count',
    prompt: `Implement \`gridColumnCount\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function gridColumnCount(template) {
  // Implement this function
  
}`,
      typescript: `function gridColumnCount(template: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function gridColumnCount(template) {
  return template.trim().split(/\\s+/).length;
}`,
      typescript: `function gridColumnCount(template: string) {
  return template.trim().split(/\\s+/).length;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'gridColumnCount');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('gridColumnCount', 'return Boolean(gridColumnCount("1fr 1fr 1fr") === 3)');
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
    { label: 'Count Grid Columns', url: 'https://developer.mozilla.org/' }
  ],
};
