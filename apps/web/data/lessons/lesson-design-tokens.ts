import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonDesignTokens: Lesson = {
  id: 'lesson-design-tokens',
  title: 'Design Token Systems',
  category: 'fe-advanced',
  difficulty: 'intermediate',
  relatedChallengeIds: ["fea-14"],
  estimatedMinutes: 10,
  concepts: ["design tokens","theming"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Design Token Systems** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** design tokens, theming
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function resolveToken(name, tokens) {
  let val = tokens[name];
  while (val && val.startsWith('{') && val.endsWith('}')) {
    val = tokens[val.slice(1, -1)];
  }
  return val;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **design tokens**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-design-tokens',
    prompt: `Resolve token references like {color.brand} to final values.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function resolveToken(name, tokens) {
  
}`,
      typescript: `function resolveToken(name: string, tokens: Record<string, string>): string {
  
}`,
    },
    solution: {
      javascript: `function resolveToken(name, tokens) {
  let val = tokens[name];
  while (val && val.startsWith('{') && val.endsWith('}')) {
    val = tokens[val.slice(1, -1)];
  }
  return val;
}`,
      typescript: `function resolveToken(name: string, tokens: Record<string, string>): string {
  let val = tokens[name];
  while (val && val.startsWith('{') && val.endsWith('}')) {
    val = tokens[val.slice(1, -1)];
  }
  return val;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'resolveToken');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('resolveToken', 'return Boolean(resolveToken(\'color.text\', { \'color.brand\': \'#FF6B35\', \'color.text\': \'{color.brand}\' }) === \'#FF6B35\')');
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
    { label: 'CSS custom properties — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties' }
  ],
};
