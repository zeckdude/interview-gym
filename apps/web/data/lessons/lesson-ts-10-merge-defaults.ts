import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs10MergeDefaults: Lesson = {
  id: 'lesson-ts-10-merge-defaults',
  title: 'Merge With Defaults',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'easy',
  relatedChallengeIds: ['ts-10-merge-defaults'],
  estimatedMinutes: 10,
  concepts: ["spread","defaults"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Merge With Defaults** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** spread, defaults
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function withDefaults(defaults, overrides) {
  return { ...defaults, ...overrides };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **spread**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-10-merge-defaults',
    prompt: `Implement \`withDefaults\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function withDefaults(defaults, overrides) {
  // Implement this function
  
}`,
      typescript: `function withDefaults(defaults: Record<string, unknown>, overrides: Record<string, unknown>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function withDefaults(defaults, overrides) {
  return { ...defaults, ...overrides };
}`,
      typescript: `function withDefaults(defaults: Record<string, unknown>, overrides: Record<string, unknown>) {
  return { ...defaults, ...overrides };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'withDefaults');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('withDefaults', 'return Boolean(JSON.stringify(withDefaults({"a":1,"b":2}, {"b":9,"c":3})) === JSON.stringify({"a":1,"b":9,"c":3}))');
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
    { label: 'Merge With Defaults', url: 'https://developer.mozilla.org/' }
  ],
};
