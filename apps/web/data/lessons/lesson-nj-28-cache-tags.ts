import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNj28CacheTags: Lesson = {
  id: 'lesson-nj-28-cache-tags',
  title: 'Compute Cache Tags',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'advanced',
  relatedChallengeIds: ['nj-28-cache-tags'],
  estimatedMinutes: 10,
  concepts: ["caching","tags","data fetching"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Compute Cache Tags** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** caching, tags, data fetching
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function computeCacheTags(resource) {
  const tags = new Set(['app']);
    if (resource.type) tags.add(\`type:\${resource.type}\`);
    if (resource.id) tags.add(\`\${resource.type ?? 'item'}:\${resource.id}\`);
    if (resource.tenantId) tags.add(\`tenant:\${resource.tenantId}\`);
    return [...tags];
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **caching**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-nj-28-cache-tags',
    prompt: `Implement \`computeCacheTags(resource)\` — derive revalidation tag strings for cache invalidation.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function computeCacheTags(resource) {
  // Implement this function
  
}`,
      typescript: `function computeCacheTags(resource: { type?: string; id?: string; tenantId?: string }) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function computeCacheTags(resource) {
  const tags = new Set(['app']);
    if (resource.type) tags.add(\`type:\${resource.type}\`);
    if (resource.id) tags.add(\`\${resource.type ?? 'item'}:\${resource.id}\`);
    if (resource.tenantId) tags.add(\`tenant:\${resource.tenantId}\`);
    return [...tags];
}`,
      typescript: `function computeCacheTags(resource: { type?: string; id?: string; tenantId?: string }) {
  const tags = new Set(['app']);
    if (resource.type) tags.add(\`type:\${resource.type}\`);
    if (resource.id) tags.add(\`\${resource.type ?? 'item'}:\${resource.id}\`);
    if (resource.tenantId) tags.add(\`tenant:\${resource.tenantId}\`);
    return [...tags];
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'computeCacheTags');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('computeCacheTags', `return Boolean(JSON.stringify(computeCacheTags({"type":"post","id":"42","tenantId":"acme"})) === JSON.stringify(["app","type:post","post:42","tenant:acme"]));`);
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
    { label: 'Compute Cache Tags', url: 'https://developer.mozilla.org/' }
  ],
};
