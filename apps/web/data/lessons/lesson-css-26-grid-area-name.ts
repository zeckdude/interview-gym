import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss26GridAreaName: Lesson = {
  id: 'lesson-css-26-grid-area-name',
  title: 'Parse Grid Area',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'advanced',
  relatedChallengeIds: ['css-26-grid-area-name'],
  estimatedMinutes: 10,
  concepts: ["grid"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Parse Grid Area** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** grid
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function parseGridArea(area) {
  const parts = area.split('/');
    return { rowStart: parts[0].trim(), colStart: parts[1]?.trim() ?? parts[0].trim() };
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
    id: 'mini-css-26-grid-area-name',
    prompt: `Implement \`parseGridArea\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function parseGridArea(area) {
  // Implement this function
  
}`,
      typescript: `function parseGridArea(area: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function parseGridArea(area) {
  const parts = area.split('/');
    return { rowStart: parts[0].trim(), colStart: parts[1]?.trim() ?? parts[0].trim() };
}`,
      typescript: `function parseGridArea(area: string) {
  const parts = area.split('/');
    return { rowStart: parts[0].trim(), colStart: parts[1]?.trim() ?? parts[0].trim() };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'parseGridArea');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('parseGridArea', 'return Boolean(JSON.stringify(parseGridArea("header / sidebar")) === JSON.stringify({"rowStart":"header","colStart":"sidebar"}))');
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
    { label: 'Parse Grid Area', url: 'https://developer.mozilla.org/' }
  ],
};
