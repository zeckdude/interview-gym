import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss28DesignTokenResolve: Lesson = {
  id: 'lesson-css-28-design-token-resolve',
  title: 'Resolve Design Token',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'advanced',
  relatedChallengeIds: ['css-28-design-token-resolve'],
  estimatedMinutes: 10,
  concepts: ["design tokens"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Resolve Design Token** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** design tokens
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function resolveToken(name, tokens) {
  let val = tokens[name];
    while (val && val.startsWith('{') && val.endsWith('}')) val = tokens[val.slice(1, -1)];
    return val;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **design tokens**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-28-design-token-resolve',
    prompt: `Implement \`resolveToken\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function resolveToken(name, tokens) {
  // Implement this function
  
}`,
      typescript: `function resolveToken(name: string, tokens: Record<string, string>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function resolveToken(name, tokens) {
  let val = tokens[name];
    while (val && val.startsWith('{') && val.endsWith('}')) val = tokens[val.slice(1, -1)];
    return val;
}`,
      typescript: `function resolveToken(name: string, tokens: Record<string, string>) {
  let val = tokens[name];
    while (val && val.startsWith('{') && val.endsWith('}')) val = tokens[val.slice(1, -1)];
    return val;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'resolveToken');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('resolveToken', 'return Boolean(resolveToken("color.text", {"color.brand":"#ff6b35","color.text":"{color.brand}"}) === "#ff6b35")');
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
    { label: 'Resolve Design Token', url: 'https://developer.mozilla.org/' }
  ],
};
