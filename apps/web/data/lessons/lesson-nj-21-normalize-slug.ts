import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNj21NormalizeSlug: Lesson = {
  id: 'lesson-nj-21-normalize-slug',
  title: 'Normalize URL Slug',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'easy',
  relatedChallengeIds: ['nj-21-normalize-slug'],
  estimatedMinutes: 10,
  concepts: ["routing","strings","slugs"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Normalize URL Slug** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** routing, strings, slugs
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function normalizeSlug(input) {
  return input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\\s-]/g, '')
      .replace(/\\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-\$/g, '');
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **routing**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-nj-21-normalize-slug',
    prompt: `Implement \`normalizeSlug(input)\` — produce a URL-safe slug from arbitrary text.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function normalizeSlug(input) {
  // Implement this function
  
}`,
      typescript: `function normalizeSlug(input: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function normalizeSlug(input) {
  return input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\\s-]/g, '')
      .replace(/\\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-\$/g, '');
}`,
      typescript: `function normalizeSlug(input: string) {
  return input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\\s-]/g, '')
      .replace(/\\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-\$/g, '');
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'normalizeSlug');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('normalizeSlug', `return Boolean(normalizeSlug("Hello World") === "hello-world");`);
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
    { label: 'Normalize URL Slug', url: 'https://developer.mozilla.org/' }
  ],
};
