import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNjAdvancedRouting: Lesson = {
  id: 'lesson-nj-advanced-routing',
  title: 'Parallel Routes & Intercepting Routes',
  category: 'nextjs',
  difficulty: 'intermediate',
  relatedChallengeIds: ['nj-09-parallel-intercepting-routes', 'nj-11-error-handling'],
  estimatedMinutes: 16,
  concepts: ['parallel routes', 'intercepting routes', 'slots', 'modals'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Parallel routes** render multiple independent pages in the same layout at once, using named "slots" via the \`@folder\` convention (\`@team\`, \`@analytics\`). Each slot streams in independently with its own \`loading.tsx\`/\`error.tsx\` — a slow widget doesn't block the rest of the dashboard.

**Intercepting routes** let a navigation render a route **in the context of the current page** (like a modal) instead of fully navigating away, using \`(.)\`, \`(..)\`, \`(..)(..)\`, or \`(...)\` prefixes that describe how many segment levels up to match against.

**They're almost always used together.** The classic pattern: clicking a photo in a feed opens it as a modal (soft navigation, feed stays mounted underneath) via an intercepting route rendering into a parallel \`@modal\` slot — but sharing or refreshing that same URL loads the full, standalone photo page instead, because the interception only applies to soft (client-side) navigation.

**Don't forget \`default.tsx\`.** Any parallel route slot without a matching sub-route for the current URL needs a \`default.tsx\` fallback, or Next.js will 404 on a hard navigation/refresh.
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      content: `app/
  feed/
    page.tsx                      // the feed
    @modal/
      (.)photo/[id]/page.tsx      // intercepted: renders as a modal from feed
      default.tsx                 // fallback: nothing to show when no modal is active
    layout.tsx                    // receives { children, modal } props
  photo/
    [id]/page.tsx                 // full standalone page: shown on direct visit/refresh`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**"The modal will show up if I refresh the page on that URL."** It won't — intercepting routes only apply to client-side (soft) navigation from within the app. A hard navigation or refresh always renders the non-intercepted, full standalone route. This is actually the *point*: shareable/SEO-friendly URLs get the full page, in-app clicks get the modal.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-nj-advanced-routing',
    prompt: `Implement parseInterceptPattern(segment) — parse a folder segment like '(.)photo', '(..)photo', '(..)(..)feed', or '(...)photo' into { levels, target }, where levels is 0 for same-level, a number for N levels up, or 'root' for from-root.`,
    timeLimitSeconds: 180,
    starterCode: {
      javascript: `function parseInterceptPattern(segment) {
  
}`,
      typescript: `function parseInterceptPattern(
  segment: string
): { levels: number | 'root'; target: string } {
  
}`,
    },
    solution: {
      javascript: `function parseInterceptPattern(segment) {
  if (segment.startsWith('(...)')) {
    return { levels: 'root', target: segment.slice('(...)'.length) };
  }
  if (segment.startsWith('(.)')) {
    return { levels: 0, target: segment.slice('(.)'.length) };
  }
  let levels = 0;
  let rest = segment;
  while (rest.startsWith('(..)')) {
    levels++;
    rest = rest.slice('(..)'.length);
  }
  return { levels, target: rest };
}`,
      typescript: `function parseInterceptPattern(
  segment: string
): { levels: number | 'root'; target: string } {
  if (segment.startsWith('(...)')) {
    return { levels: 'root', target: segment.slice('(...)'.length) };
  }
  if (segment.startsWith('(.)')) {
    return { levels: 0, target: segment.slice('(.)'.length) };
  }
  let levels = 0;
  let rest = segment;
  while (rest.startsWith('(..)')) {
    levels++;
    rest = rest.slice('(..)'.length);
  }
  return { levels, target: rest };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'parseInterceptPattern');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function(
          'parseInterceptPattern',
          `return Boolean(
            JSON.stringify(parseInterceptPattern('(.)photo')) === JSON.stringify({ levels: 0, target: 'photo' }) &&
            JSON.stringify(parseInterceptPattern('(..)photo')) === JSON.stringify({ levels: 1, target: 'photo' }) &&
            JSON.stringify(parseInterceptPattern('(..)(..)feed')) === JSON.stringify({ levels: 2, target: 'feed' }) &&
            JSON.stringify(parseInterceptPattern('(...)photo')) === JSON.stringify({ levels: 'root', target: 'photo' })
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
    { label: 'Parallel Routes — Next.js Docs', url: 'https://nextjs.org/docs/app/building-your-application/routing/parallel-routes' },
    { label: 'Intercepting Routes — Next.js Docs', url: 'https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes' },
  ],
};
