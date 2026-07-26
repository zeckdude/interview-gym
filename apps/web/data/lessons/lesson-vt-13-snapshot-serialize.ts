import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt13SnapshotSerialize: Lesson = {
  id: 'lesson-vt-13-snapshot-serialize',
  title: 'Snapshot Serializer',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'intermediate',
  relatedChallengeIds: ['vt-13-snapshot-serialize'],
  estimatedMinutes: 10,
  concepts: ["snapshots"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Snapshot Serializer** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** snapshots
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function snapshotValue(value) {
  return JSON.stringify(value, null, 2);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **snapshots**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-13-snapshot-serialize',
    prompt: `Implement \`snapshotValue\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function snapshotValue(value) {
  // Implement this function
  
}`,
      typescript: `function snapshotValue(value: unknown) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function snapshotValue(value) {
  return JSON.stringify(value, null, 2);
}`,
      typescript: `function snapshotValue(value: unknown) {
  return JSON.stringify(value, null, 2);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'snapshotValue');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('snapshotValue', 'return Boolean(snapshotValue({"a":1}) === "{\\n  \\"a\\": 1\\n}")');
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
    { label: 'Snapshot Serializer', url: 'https://developer.mozilla.org/' }
  ],
};
