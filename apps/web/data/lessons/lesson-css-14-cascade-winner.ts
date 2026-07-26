import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss14CascadeWinner: Lesson = {
  id: 'lesson-css-14-cascade-winner',
  title: 'Pick Winning Cascade Rule',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'intermediate',
  relatedChallengeIds: ['css-14-cascade-winner'],
  estimatedMinutes: 10,
  concepts: ["cascade","specificity"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Pick Winning Cascade Rule** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** cascade, specificity
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function pickWinningRule(rules) {
  return rules.reduce((winner, rule) => (rule.specificity > winner.specificity ? rule : winner));
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **cascade**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-14-cascade-winner',
    prompt: `Implement \`pickWinningRule\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function pickWinningRule(rules) {
  // Implement this function
  
}`,
      typescript: `function pickWinningRule(rules: Array<{ selector: string; specificity: number }>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function pickWinningRule(rules) {
  return rules.reduce((winner, rule) => (rule.specificity > winner.specificity ? rule : winner));
}`,
      typescript: `function pickWinningRule(rules: Array<{ selector: string; specificity: number }>) {
  return rules.reduce((winner, rule) => (rule.specificity > winner.specificity ? rule : winner));
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'pickWinningRule');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('pickWinningRule', 'return Boolean(JSON.stringify(pickWinningRule([{"selector":".a","specificity":10},{"selector":"#id","specificity":100}])) === JSON.stringify({"selector":"#id","specificity":100}))');
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
    { label: 'Pick Winning Cascade Rule', url: 'https://developer.mozilla.org/' }
  ],
};
