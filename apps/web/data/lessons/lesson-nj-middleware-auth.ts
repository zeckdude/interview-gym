import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNjMiddlewareAuth: Lesson = {
  id: 'lesson-nj-middleware-auth',
  title: 'Middleware & Auth Patterns',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'intermediate',
  relatedChallengeIds: ['nj-07-middleware', 'nj-14-auth-patterns'],
  estimatedMinutes: 14,
  concepts: ['middleware', 'matcher config', 'edge runtime', 'auth gating', 'defense in depth'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Middleware** (\`middleware.ts\` at the project root) runs on **every matching request**, before it reaches a route or cache. It can redirect, rewrite, or attach headers/cookies — and it runs on the **Edge Runtime**, so there's no \`fs\`, no most native npm packages, and it needs to be fast since it adds latency to every request it touches.

Use the exported \`matcher\` config to scope which paths it actually runs on — you almost never want it running on every static asset request.

**Auth is layered, not single-point.** A solid architecture checks identity at multiple levels:
1. **Middleware** — coarse-grained gate: redirect unauthenticated users away from \`/dashboard/*\` before rendering starts.
2. **Server Components** — the authoritative re-check before fetching sensitive data (middleware can be bypassed by direct requests to some endpoints).
3. **Route Handlers / Server Actions** — every mutation independently re-verifies auth **and** authorization, since these are effectively public HTTP endpoints.
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'typescript',
      content: `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session');
  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings'],
};`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**"I'll just use my Node.js Prisma client inside middleware."** Middleware runs on the Edge Runtime by default — no Node.js APIs, and most traditional database drivers won't work there. Reach for an edge-compatible client (an HTTP-based driver, or just checking a signed cookie/JWT) instead of a full Node-only ORM.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-nj-middleware-auth',
    prompt: `Implement isProtectedRoute(pathname, matchers) — given matcher patterns like '/dashboard/:path*' (matches the prefix and everything under it) or an exact path like '/settings', return true if pathname should be protected.`,
    timeLimitSeconds: 150,
    starterCode: {
      javascript: `function isProtectedRoute(pathname, matchers) {
  
}`,
      typescript: `function isProtectedRoute(pathname: string, matchers: string[]): boolean {
  
}`,
    },
    solution: {
      javascript: `function isProtectedRoute(pathname, matchers) {
  return matchers.some((pattern) => {
    if (pattern.endsWith('/:path*')) {
      const prefix = pattern.slice(0, -'/:path*'.length);
      return pathname === prefix || pathname.startsWith(prefix + '/');
    }
    return pathname === pattern;
  });
}`,
      typescript: `function isProtectedRoute(pathname: string, matchers: string[]): boolean {
  return matchers.some((pattern) => {
    if (pattern.endsWith('/:path*')) {
      const prefix = pattern.slice(0, -'/:path*'.length);
      return pathname === prefix || pathname.startsWith(prefix + '/');
    }
    return pathname === pattern;
  });
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'isProtectedRoute');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function(
          'isProtectedRoute',
          `return Boolean(
            isProtectedRoute('/dashboard/settings', ['/dashboard/:path*']) === true &&
            isProtectedRoute('/dashboard', ['/dashboard/:path*']) === true &&
            isProtectedRoute('/about', ['/dashboard/:path*', '/settings']) === false &&
            isProtectedRoute('/settings', ['/dashboard/:path*', '/settings']) === true
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
    { label: 'Middleware — Next.js Docs', url: 'https://nextjs.org/docs/app/building-your-application/routing/middleware' },
    { label: 'Authentication — Next.js Docs', url: 'https://nextjs.org/docs/app/building-your-application/authentication' },
  ],
};
