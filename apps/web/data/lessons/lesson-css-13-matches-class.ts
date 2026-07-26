import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss13MatchesClass: Lesson = {
  id: 'lesson-css-13-matches-class',
  title: 'Match Simple Class Selector',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'intermediate',
  relatedChallengeIds: ['css-13-matches-class'],
  estimatedMinutes: 10,
  concepts: ["selectors"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Match Simple Class Selector** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** selectors
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function matchesClass(el, className) {
  return el.classList.includes(className.replace('.', ''));
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **selectors**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-13-matches-class',
    prompt: `Implement \`matchesClass\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function matchesClass(el, className) {
  // Implement this function
  
}`,
      typescript: `function matchesClass(el: { classList: string[] }, className: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function matchesClass(el, className) {
  return el.classList.includes(className.replace('.', ''));
}`,
      typescript: `function matchesClass(el: { classList: string[] }, className: string) {
  return el.classList.includes(className.replace('.', ''));
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'matchesClass');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('matchesClass', 'return Boolean(matchesClass({"classList":["btn","primary"]}, ".primary") === true)');
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
    { label: 'Match Simple Class Selector', url: 'https://developer.mozilla.org/' }
  ],
};
