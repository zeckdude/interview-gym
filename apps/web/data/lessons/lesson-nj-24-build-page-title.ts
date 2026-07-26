import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNj24BuildPageTitle: Lesson = {
  id: 'lesson-nj-24-build-page-title',
  title: 'Build Page Title',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'easy',
  relatedChallengeIds: ['nj-24-build-page-title'],
  estimatedMinutes: 10,
  concepts: ["metadata","SEO","titles"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Build Page Title** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** metadata, SEO, titles
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function buildPageTitle(pageTitle, sectionTitle, siteName) {
  const parts = [pageTitle, sectionTitle, siteName].filter(Boolean);
    return parts.join(' | ');
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
    id: 'mini-nj-24-build-page-title',
    prompt: `Implement \`buildPageTitle(pageTitle, sectionTitle, siteName)\` — format a document title with \` | \` separators.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function buildPageTitle(pageTitle, sectionTitle, siteName) {
  // Implement this function
  
}`,
      typescript: `function buildPageTitle(pageTitle: string, sectionTitle: string, siteName: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function buildPageTitle(pageTitle, sectionTitle, siteName) {
  const parts = [pageTitle, sectionTitle, siteName].filter(Boolean);
    return parts.join(' | ');
}`,
      typescript: `function buildPageTitle(pageTitle: string, sectionTitle: string, siteName: string) {
  const parts = [pageTitle, sectionTitle, siteName].filter(Boolean);
    return parts.join(' | ');
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'buildPageTitle');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('buildPageTitle', `return Boolean(buildPageTitle("Pricing", "Product", "Acme") === "Pricing | Product | Acme");`);
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
    { label: 'Build Page Title', url: 'https://developer.mozilla.org/' }
  ],
};
