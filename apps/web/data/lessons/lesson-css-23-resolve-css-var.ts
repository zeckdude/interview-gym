import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss23ResolveCssVar: Lesson = {
  id: 'lesson-css-23-resolve-css-var',
  title: 'Resolve CSS Variable',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'advanced',
  relatedChallengeIds: ['css-23-resolve-css-var'],
  estimatedMinutes: 10,
  concepts: ["custom properties"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Resolve CSS Variable** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** custom properties
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function resolveVar(value, vars) {
  if (!value.startsWith('var(')) return value;
    const name = value.slice(4, -1).trim();
    return vars[name] ?? value;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **custom properties**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-23-resolve-css-var',
    prompt: `Implement \`resolveVar\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function resolveVar(value, vars) {
  // Implement this function
  
}`,
      typescript: `function resolveVar(value: string, vars: Record<string, string>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function resolveVar(value, vars) {
  if (!value.startsWith('var(')) return value;
    const name = value.slice(4, -1).trim();
    return vars[name] ?? value;
}`,
      typescript: `function resolveVar(value: string, vars: Record<string, string>) {
  if (!value.startsWith('var(')) return value;
    const name = value.slice(4, -1).trim();
    return vars[name] ?? value;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'resolveVar');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('resolveVar', 'return Boolean(resolveVar("var(--brand)", {"--brand":"#ff6b35"}) === "#ff6b35")');
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
    { label: 'Resolve CSS Variable', url: 'https://developer.mozilla.org/' }
  ],
};
