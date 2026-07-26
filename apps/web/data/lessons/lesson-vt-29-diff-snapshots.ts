import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt29DiffSnapshots: Lesson = {
  id: 'lesson-vt-29-diff-snapshots',
  title: 'Diff Snapshots',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'advanced',
  relatedChallengeIds: ['vt-29-diff-snapshots'],
  estimatedMinutes: 10,
  concepts: ["snapshot diff"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Diff Snapshots** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** snapshot diff
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function diffSnapshots(a, b) {
  const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((k) => a[k] === b[k]);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **snapshot diff**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-29-diff-snapshots',
    prompt: `Implement \`diffSnapshots\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function diffSnapshots(a, b) {
  // Implement this function
  
}`,
      typescript: `function diffSnapshots(a: Record<string, unknown>, b: Record<string, unknown>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function diffSnapshots(a, b) {
  const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((k) => a[k] === b[k]);
}`,
      typescript: `function diffSnapshots(a: Record<string, unknown>, b: Record<string, unknown>) {
  const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((k) => a[k] === b[k]);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'diffSnapshots');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('diffSnapshots', 'return Boolean(diffSnapshots({"x":1}, {"x":1}) === true)');
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
    { label: 'Diff Snapshots', url: 'https://developer.mozilla.org/' }
  ],
};
