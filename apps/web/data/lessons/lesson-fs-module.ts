import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFsModule: Lesson = {
  id: 'lesson-fs-module',
  title: 'Node.js fs Module — Reading and Writing Files',
  category: 'be-nodejs',
  topLevel: 'be',
  subcategory: 'nodejs',
  difficulty: 'easy',
  relatedChallengeIds: ["be-01-list-files","be-02-read-write-file","be-03-async-file-read"],
  estimatedMinutes: 10,
  concepts: ["fs","readFile","writeFile","sync vs async"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Node.js fs Module** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** fs, readFile, writeFile, sync vs async
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function joinPath(base, segment) {
  const trimmed = base.endsWith('/') ? base.slice(0, -1) : base;
  const seg = segment.startsWith('/') ? segment.slice(1) : segment;
  return trimmed + '/' + seg;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **fs**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fs-module',
    prompt: `Implement joinPath(base, segment) that joins path segments cleanly — no double slashes.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function joinPath(base, segment) {
  // Return base + '/' + segment (no double slashes)
  
}`,
      typescript: `function joinPath(base: string, segment: string): string {
  // Return base + '/' + segment (no double slashes)
  
}`,
    },
    solution: {
      javascript: `function joinPath(base, segment) {
  const trimmed = base.endsWith('/') ? base.slice(0, -1) : base;
  const seg = segment.startsWith('/') ? segment.slice(1) : segment;
  return trimmed + '/' + seg;
}`,
      typescript: `function joinPath(base: string, segment: string): string {
  const trimmed = base.endsWith('/') ? base.slice(0, -1) : base;
  const seg = segment.startsWith('/') ? segment.slice(1) : segment;
  return trimmed + '/' + seg;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'joinPath');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('joinPath', 'return Boolean(joinPath(\'/data\', \'users.json\') === \'/data/users.json\' && joinPath(\'/data/\', \'/users.json\') === \'/data/users.json\')');
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
    { label: 'Node.js fs module', url: 'https://nodejs.org/api/fs.html' }
  ],
};
