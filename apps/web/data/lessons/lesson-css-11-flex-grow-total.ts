import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss11FlexGrowTotal: Lesson = {
  id: 'lesson-css-11-flex-grow-total',
  title: 'Flex Grow Distribution',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'intermediate',
  relatedChallengeIds: ['css-11-flex-grow-total'],
  estimatedMinutes: 10,
  concepts: ["flexbox"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Flex Grow Distribution** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** flexbox
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function flexGrowTotal(items) {
  return items.reduce((sum, item) => sum + item.grow, 0);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **flexbox**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-11-flex-grow-total',
    prompt: `Implement \`flexGrowTotal\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function flexGrowTotal(items) {
  // Implement this function
  
}`,
      typescript: `function flexGrowTotal(items: Array<{ grow: number }>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function flexGrowTotal(items) {
  return items.reduce((sum, item) => sum + item.grow, 0);
}`,
      typescript: `function flexGrowTotal(items: Array<{ grow: number }>) {
  return items.reduce((sum, item) => sum + item.grow, 0);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'flexGrowTotal');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('flexGrowTotal', 'return Boolean(flexGrowTotal([{"grow":1},{"grow":2},{"grow":1}]) === 4)');
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
    { label: 'Flex Grow Distribution', url: 'https://developer.mozilla.org/' }
  ],
};
