import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs28ShallowDiff: Lesson = {
  id: 'lesson-ts-28-shallow-diff',
  title: 'Shallow Object Diff',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'advanced',
  relatedChallengeIds: ['ts-28-shallow-diff'],
  estimatedMinutes: 10,
  concepts: ["objects","diff"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Shallow Object Diff** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** objects, diff
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function shallowDiff(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    const diff = {};
    for (const key of keys) {
      if (a[key] !== b[key]) diff[key] = b[key];
    }
    return diff;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **objects**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-28-shallow-diff',
    prompt: `Implement \`shallowDiff\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function shallowDiff(a, b) {
  // Implement this function
  
}`,
      typescript: `function shallowDiff(a: Record<string, unknown>, b: Record<string, unknown>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function shallowDiff(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    const diff = {};
    for (const key of keys) {
      if (a[key] !== b[key]) diff[key] = b[key];
    }
    return diff;
}`,
      typescript: `function shallowDiff(a: Record<string, unknown>, b: Record<string, unknown>) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    const diff = {};
    for (const key of keys) {
      if (a[key] !== b[key]) diff[key] = b[key];
    }
    return diff;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'shallowDiff');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('shallowDiff', 'return Boolean(JSON.stringify(shallowDiff({"a":1,"b":2}, {"a":1,"b":9,"c":3})) === JSON.stringify({"b":9,"c":3}))');
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
    { label: 'Shallow Object Diff', url: 'https://developer.mozilla.org/' }
  ],
};
