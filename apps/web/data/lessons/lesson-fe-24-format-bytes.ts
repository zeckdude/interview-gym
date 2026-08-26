import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe24FormatBytes: Lesson = {
  id: 'lesson-fe-24-format-bytes',
  title: 'Format Byte Size',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'easy',
  relatedChallengeIds: ['fe-24-format-bytes'],
  estimatedMinutes: 12,
  concepts: ['numbers', 'formatting', 'strings'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
Every file manager, cloud storage dashboard, and download progress bar shows sizes like "1.5 MB" instead of raw byte counts. Users can't parse \`1572864\` — they need human-readable labels.

Interviewers ask this to test **number manipulation**, **logarithms for unit selection**, and **string formatting** — all in one small function.
      `,
    },
    {
      type: 'explanation',
      title: 'How Byte Formatting Works',
      content: `
File sizes use **binary units** (powers of 1024):

- 1 KB = 1,024 bytes
- 1 MB = 1,024² bytes
- 1 GB = 1,024³ bytes

To pick the right unit, find which power of 1024 the byte count falls into:

\`unitIndex = Math.floor(Math.log(bytes) / Math.log(1024))\`

Then divide: \`value = bytes / Math.pow(1024, unitIndex)\`

**Special case:** \`0 bytes\` → \`"0 B"\` (log of 0 is undefined).
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, i);
  return \`\${Math.round(value * 10) / 10} \${units[i]}\`;
}

formatBytes(0);       // "0 B"
formatBytes(1536);    // "1.5 KB"`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `// Interviewer: "What about decimal (SI) units vs binary (IEC)?"
// Binary (1024): KB, MB, GB — what we use here
// Decimal (1000): kB, MB, GB — used by some hard drive manufacturers

// Interviewer: "Round to 2 decimal places instead of 1"
function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  const factor = Math.pow(10, decimals);
  return \`\${Math.round(value * factor) / factor} \${units[i]}\`;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**Forgetting the \`bytes === 0\` guard.** \`Math.log(0)\` returns \`-Infinity\`, which breaks unit selection.

**Using 1000 instead of 1024** without clarifying. In interviews, state which convention you're using. Production code should match your product's existing format.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Format Manually',
      content: `
**Don't hand-roll this in production if \`Intl.NumberFormat\` or a library** (e.g. \`bytes\` npm package) covers your locale and unit needs.

**Don't format bytes for calculations** — keep raw numbers internally, format only for display.
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
    { label: 'Math.log — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log' },
    { label: 'Template literals — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
