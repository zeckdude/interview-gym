import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss07SpecificityScore: Lesson = {
  id: 'lesson-css-07-specificity-score',
  title: 'Selector Specificity Score',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'easy',
  relatedChallengeIds: ['css-07-specificity-score'],
  estimatedMinutes: 10,
  concepts: ["specificity","cascade"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Selector Specificity Score** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** specificity, cascade
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function specificity(selector) {
  const ids = (selector.match(/#/g) || []).length;
    const classes = (selector.match(/\\./g) || []).length + (selector.match(/\\[/g) || []).length;
    const elements = (selector.match(/[a-zA-Z]/g) || []).length;
    return ids * 100 + classes * 10 + elements;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **specificity**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-07-specificity-score',
    prompt: `Implement \`specificity\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function specificity(selector) {
  // Implement this function
  
}`,
      typescript: `function specificity(selector: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function specificity(selector) {
  const ids = (selector.match(/#/g) || []).length;
    const classes = (selector.match(/\\./g) || []).length + (selector.match(/\\[/g) || []).length;
    const elements = (selector.match(/[a-zA-Z]/g) || []).length;
    return ids * 100 + classes * 10 + elements;
}`,
      typescript: `function specificity(selector: string) {
  const ids = (selector.match(/#/g) || []).length;
    const classes = (selector.match(/\\./g) || []).length + (selector.match(/\\[/g) || []).length;
    const elements = (selector.match(/[a-zA-Z]/g) || []).length;
    return ids * 100 + classes * 10 + elements;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'specificity');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('specificity', 'return Boolean(specificity("#nav.active") === 110)');
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
    { label: 'Selector Specificity Score', url: 'https://developer.mozilla.org/' }
  ],
};
