import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe24FormatBytes: Lesson = {
  id: 'lesson-fe-24-format-bytes',
  title: 'Format Byte Size',
  category: 'fe',
  topLevel: 'fe',
  subcategory: null,
  difficulty: 'easy',
  relatedChallengeIds: ['fe-24-format-bytes'],
  estimatedMinutes: 10,
  concepts: ["numbers","formatting"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Format Byte Size** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** numbers, formatting
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, i);
    return \`\${Math.round(value * 10) / 10} \${units[i]}\`;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **numbers**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fe-24-format-bytes',
    prompt: `Implement \`formatBytes(bytes)\` — human-readable file sizes using 1024-based units.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function formatBytes(bytes) {
  // Implement this function
  
}`,
      typescript: `function formatBytes(bytes: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, i);
    return \`\${Math.round(value * 10) / 10} \${units[i]}\`;
}`,
      typescript: `function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, i);
    return \`\${Math.round(value * 10) / 10} \${units[i]}\`;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'formatBytes');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('formatBytes', `return Boolean(formatBytes(0) === "0 B");`);
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
    { label: 'Format Byte Size', url: 'https://developer.mozilla.org/' }
  ],
};
