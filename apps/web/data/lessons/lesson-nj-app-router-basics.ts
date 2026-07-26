import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNjAppRouterBasics: Lesson = {
  id: 'lesson-nj-app-router-basics',
  title: 'App Router: File Conventions & Routing',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'intermediate',
  relatedChallengeIds: ['nj-01-page-routing', 'nj-04-metadata-seo'],
  estimatedMinutes: 14,
  concepts: ['file-based routing', 'special files', 'route groups', 'dynamic segments', 'metadata'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
The **App Router** turns your folder structure directly into your URL structure — no route config file to maintain.

**The special files you need to know:**
- \`page.tsx\` — makes a route segment publicly accessible and renders the UI for it
- \`layout.tsx\` — wraps a segment and its children; **persists across navigations** (doesn't remount when you click between child pages)
- \`loading.tsx\` — an automatic Suspense fallback shown while the segment loads
- \`error.tsx\` — an automatic error boundary for the segment
- \`not-found.tsx\` — rendered when \`notFound()\` is called or a route can't be matched

**Dynamic segments:**
- \`[slug]\` — matches a single path segment (e.g. \`/blog/hello\`)
- \`[...slug]\` — catch-all, matches one or more segments (e.g. \`/docs/a/b/c\`)
- \`[[...slug]]\` — optional catch-all, also matches the base path with zero segments

**Route groups** — a folder wrapped in parentheses, like \`(marketing)\`, organizes routes and lets you apply a shared layout **without adding a segment to the URL**.
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'typescript',
      content: `// app/blog/[slug]/page.tsx
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  return <article>{post.title}</article>;
}

// app/docs/[...slug]/page.tsx  ->  matches /docs/a/b/c
export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params; // ['a', 'b', 'c']
  return <pre>{slug.join('/')}</pre>;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**"Route groups change the URL"** — they don't. \`(marketing)/about/page.tsx\` is still just \`/about\`. The parentheses folder exists purely to apply a shared layout to a subset of routes without nesting a real segment.

**"layout.tsx re-runs on every page change"** — it doesn't. A layout persists and keeps its React state across navigations between its child pages. If you need code that re-runs on *every* navigation within that subtree, it usually belongs in the \`page.tsx\`, not the shared layout.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-nj-app-router-basics',
    prompt: `Implement matchRoute(pattern, pathname) — a mini version of the App Router's file-based matcher. Support [param] dynamic segments and [...param] catch-all segments. Return an object of extracted params, or null if there's no match.`,
    timeLimitSeconds: 150,
    starterCode: {
      javascript: `function matchRoute(pattern, pathname) {
  
}`,
      typescript: `function matchRoute(
  pattern: string,
  pathname: string
): Record<string, string | string[]> | null {
  
}`,
    },
    solution: {
      javascript: `function matchRoute(pattern, pathname) {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);
  const params = {};

  for (let i = 0; i < patternParts.length; i++) {
    const part = patternParts[i];

    if (part.startsWith('[...') && part.endsWith(']')) {
      const name = part.slice(4, -1);
      if (i > pathParts.length - 1) return null;
      params[name] = pathParts.slice(i);
      return params;
    }

    if (part.startsWith('[') && part.endsWith(']')) {
      const name = part.slice(1, -1);
      if (pathParts[i] === undefined) return null;
      params[name] = pathParts[i];
      continue;
    }

    if (pathParts[i] !== part) return null;
  }

  if (patternParts.length !== pathParts.length) return null;
  return params;
}`,
      typescript: `function matchRoute(
  pattern: string,
  pathname: string
): Record<string, string | string[]> | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);
  const params: Record<string, string | string[]> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const part = patternParts[i];

    if (part.startsWith('[...') && part.endsWith(']')) {
      const name = part.slice(4, -1);
      if (i > pathParts.length - 1) return null;
      params[name] = pathParts.slice(i);
      return params;
    }

    if (part.startsWith('[') && part.endsWith(']')) {
      const name = part.slice(1, -1);
      if (pathParts[i] === undefined) return null;
      params[name] = pathParts[i];
      continue;
    }

    if (pathParts[i] !== part) return null;
  }

  if (patternParts.length !== pathParts.length) return null;
  return params;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'matchRoute');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function(
          'matchRoute',
          `return Boolean(
            JSON.stringify(matchRoute('/blog/[slug]', '/blog/hello-world')) === JSON.stringify({ slug: 'hello-world' }) &&
            matchRoute('/blog/[slug]', '/blog') === null &&
            JSON.stringify(matchRoute('/docs/[...slug]', '/docs/a/b/c')) === JSON.stringify({ slug: ['a', 'b', 'c'] })
          )`
        );
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
    { label: 'Routing Fundamentals — Next.js Docs', url: 'https://nextjs.org/docs/app/building-your-application/routing' },
    { label: 'File Conventions — Next.js Docs', url: 'https://nextjs.org/docs/app/api-reference/file-conventions' },
  ],
};
