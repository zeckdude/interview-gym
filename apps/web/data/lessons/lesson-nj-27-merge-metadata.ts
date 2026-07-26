import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNj27MergeMetadata: Lesson = {
  id: 'lesson-nj-27-merge-metadata',
  title: 'Merge Metadata Objects',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'intermediate',
  relatedChallengeIds: ['nj-27-merge-metadata'],
  estimatedMinutes: 10,
  concepts: ["metadata","objects","Next.js"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Merge Metadata Objects** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** metadata, objects, Next.js
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function mergeMetadata(base, override) {
  const result = { ...base };
    for (const [key, value] of Object.entries(override)) {
      if (value == null) continue;
      if (typeof value === 'object' && !Array.isArray(value) && typeof result[key] === 'object' && result[key] != null && !Array.isArray(result[key])) {
        result[key] = mergeMetadata(result[key], value);
      } else {
        result[key] = value;
      }
    }
    return result;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **metadata**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-nj-27-merge-metadata',
    prompt: `Implement \`mergeMetadata(base, override)\` — deep-merge Next.js-style metadata objects.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function mergeMetadata(base, override) {
  // Implement this function
  
}`,
      typescript: `function mergeMetadata(base: Record<string, unknown>, override: Record<string, unknown>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function mergeMetadata(base, override) {
  const result = { ...base };
    for (const [key, value] of Object.entries(override)) {
      if (value == null) continue;
      if (typeof value === 'object' && !Array.isArray(value) && typeof result[key] === 'object' && result[key] != null && !Array.isArray(result[key])) {
        result[key] = mergeMetadata(result[key], value);
      } else {
        result[key] = value;
      }
    }
    return result;
}`,
      typescript: `function mergeMetadata(base: Record<string, unknown>, override: Record<string, unknown>) {
  const result = { ...base };
    for (const [key, value] of Object.entries(override)) {
      if (value == null) continue;
      if (typeof value === 'object' && !Array.isArray(value) && typeof result[key] === 'object' && result[key] != null && !Array.isArray(result[key])) {
        result[key] = mergeMetadata(result[key], value);
      } else {
        result[key] = value;
      }
    }
    return result;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'mergeMetadata');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('mergeMetadata', `return Boolean(JSON.stringify(mergeMetadata({"title":"A","openGraph":{"title":"A","type":"website"}}, {"openGraph":{"title":"B"}})) === JSON.stringify({"title":"A","openGraph":{"title":"B","type":"website"}}));`);
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
    { label: 'Merge Metadata Objects', url: 'https://developer.mozilla.org/' }
  ],
};
