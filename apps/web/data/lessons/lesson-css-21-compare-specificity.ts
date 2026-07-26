import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss21CompareSpecificity: Lesson = {
  id: 'lesson-css-21-compare-specificity',
  title: 'Compare Selector Specificity',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'advanced',
  relatedChallengeIds: ['css-21-compare-specificity'],
  estimatedMinutes: 10,
  concepts: ["specificity"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Compare Selector Specificity** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** specificity
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function compareSpecificity(a, b) {
  const score = (sel) => {
      const ids = (sel.match(/#/g) || []).length;
      const classes = (sel.match(/\\./g) || []).length;
      const tags = (sel.match(/^[a-z]+|\\s[a-z]+/gi) || []).length;
      return ids * 100 + classes * 10 + tags;
    };
    return score(a) - score(b);
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
    id: 'mini-css-21-compare-specificity',
    prompt: `Implement \`compareSpecificity\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function compareSpecificity(a, b) {
  // Implement this function
  
}`,
      typescript: `function compareSpecificity(a: string, b: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function compareSpecificity(a, b) {
  const score = (sel) => {
      const ids = (sel.match(/#/g) || []).length;
      const classes = (sel.match(/\\./g) || []).length;
      const tags = (sel.match(/^[a-z]+|\\s[a-z]+/gi) || []).length;
      return ids * 100 + classes * 10 + tags;
    };
    return score(a) - score(b);
}`,
      typescript: `function compareSpecificity(a: string, b: string) {
  const score = (sel) => {
      const ids = (sel.match(/#/g) || []).length;
      const classes = (sel.match(/\\./g) || []).length;
      const tags = (sel.match(/^[a-z]+|\\s[a-z]+/gi) || []).length;
      return ids * 100 + classes * 10 + tags;
    };
    return score(a) - score(b);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'compareSpecificity');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('compareSpecificity', 'return Boolean(compareSpecificity(".nav", "#nav") === -90)');
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
    { label: 'Compare Selector Specificity', url: 'https://developer.mozilla.org/' }
  ],
};
