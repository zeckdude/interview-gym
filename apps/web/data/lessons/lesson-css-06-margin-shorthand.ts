import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss06MarginShorthand: Lesson = {
  id: 'lesson-css-06-margin-shorthand',
  title: 'Parse Margin Shorthand',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'easy',
  relatedChallengeIds: ['css-06-margin-shorthand'],
  estimatedMinutes: 10,
  concepts: ["box model","shorthand"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Parse Margin Shorthand** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** box model, shorthand
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function parseMargin(value) {
  const parts = value.trim().split(/\\s+/);
    if (parts.length === 1) return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
    if (parts.length === 2) return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    if (parts.length === 3) return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
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
    id: 'mini-css-06-margin-shorthand',
    prompt: `Implement \`parseMargin\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function parseMargin(value) {
  // Implement this function
  
}`,
      typescript: `function parseMargin(value: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function parseMargin(value) {
  const parts = value.trim().split(/\\s+/);
    if (parts.length === 1) return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
    if (parts.length === 2) return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    if (parts.length === 3) return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
}`,
      typescript: `function parseMargin(value: string) {
  const parts = value.trim().split(/\\s+/);
    if (parts.length === 1) return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
    if (parts.length === 2) return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    if (parts.length === 3) return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'parseMargin');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('parseMargin', 'return Boolean(JSON.stringify(parseMargin("1px 2px 3px 4px")) === JSON.stringify({"top":"1px","right":"2px","bottom":"3px","left":"4px"}))');
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
    { label: 'Parse Margin Shorthand', url: 'https://developer.mozilla.org/' }
  ],
};
