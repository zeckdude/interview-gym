import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNjCaching: Lesson = {
  id: 'lesson-nj-caching',
  title: 'Next.js Caching — All Four Layers Explained',
  category: 'nextjs',
  difficulty: 'intermediate',
  relatedChallengeIds: ['nj-12-caching-strategies'],
  estimatedMinutes: 18,
  concepts: ['request memoization', 'data cache', 'full route cache', 'router cache', 'revalidation'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
Next.js has **four separate caching layers**. Confusing them is the #1 source of "why isn't my data updating?" bugs — and a favorite interview topic.

1. **Request Memoization** — identical \`fetch()\` calls within a single render pass are deduped automatically. Resets every new request; can't be manually invalidated.

2. **Data Cache** — a persistent, server-side cache for \`fetch()\` results, shared across requests and deployments. Controlled with \`cache: 'force-cache' | 'no-store'\` or \`next: { revalidate }\`. Invalidated with \`revalidateTag()\` / \`revalidatePath()\`.

3. **Full Route Cache** — the rendered HTML + RSC payload for statically rendered routes, cached at build time. Invalidated on redeploy or \`revalidatePath\`.

4. **Router Cache** — an in-memory, **client-side** cache of RSC payloads for pages you've already visited, making back/forward navigation instant. Invalidated by a full reload or \`router.refresh()\`.

**The default trap:** a \`fetch()\` call inside a Server Component is cached **indefinitely** unless you say otherwise — "no config" does not mean "always fresh."
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'typescript',
      content: `// Cached indefinitely (Data Cache + Full Route Cache)
const res = await fetch('https://api.example.com/posts');

// Never cached — always hits the network, forces dynamic rendering
const res2 = await fetch('https://api.example.com/posts', { cache: 'no-store' });

// ISR — cached, but revalidated in the background every 60s
const res3 = await fetch('https://api.example.com/posts', {
  next: { revalidate: 60, tags: ['posts'] },
});

// After a mutation, invalidate on demand:
'use server';
export async function createPost(formData: FormData) {
  await db.post.create({ /* ... */ });
  revalidateTag('posts');
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**"I updated the database in my Server Action, so the page will show the new data."** Not automatically! Mutating data does not clear any of the four caches. You must explicitly call \`revalidateTag()\` or \`revalidatePath()\` inside the action — otherwise the Data Cache and Full Route Cache will keep serving the old, cached response.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-nj-caching',
    prompt: `Implement getCacheStrategy(options) — given a fetch-like options object ({ cache?, next?: { revalidate? } }), return 'DYNAMIC' if it's never cached, 'ISR' if it revalidates on an interval, or 'STATIC' if it's cached indefinitely (the default).`,
    timeLimitSeconds: 150,
    starterCode: {
      javascript: `function getCacheStrategy(options) {
  
}`,
      typescript: `interface FetchLikeOptions {
  cache?: 'force-cache' | 'no-store';
  next?: { revalidate?: number };
}

function getCacheStrategy(options: FetchLikeOptions = {}): 'DYNAMIC' | 'ISR' | 'STATIC' {
  
}`,
    },
    solution: {
      javascript: `function getCacheStrategy(options = {}) {
  if (options.cache === 'no-store') return 'DYNAMIC';
  const revalidate = options.next && options.next.revalidate;
  if (revalidate === 0) return 'DYNAMIC';
  if (typeof revalidate === 'number' && revalidate > 0) return 'ISR';
  return 'STATIC';
}`,
      typescript: `interface FetchLikeOptions {
  cache?: 'force-cache' | 'no-store';
  next?: { revalidate?: number };
}

function getCacheStrategy(options: FetchLikeOptions = {}): 'DYNAMIC' | 'ISR' | 'STATIC' {
  if (options.cache === 'no-store') return 'DYNAMIC';
  const revalidate = options.next?.revalidate;
  if (revalidate === 0) return 'DYNAMIC';
  if (typeof revalidate === 'number' && revalidate > 0) return 'ISR';
  return 'STATIC';
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'getCacheStrategy');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function(
          'getCacheStrategy',
          `return Boolean(
            getCacheStrategy({ cache: 'no-store' }) === 'DYNAMIC' &&
            getCacheStrategy({ next: { revalidate: 60 } }) === 'ISR' &&
            getCacheStrategy({}) === 'STATIC' &&
            getCacheStrategy({ next: { revalidate: 0 } }) === 'DYNAMIC'
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
    { label: 'Caching in Next.js — Next.js Docs', url: 'https://nextjs.org/docs/app/building-your-application/caching' },
    { label: 'revalidateTag — Next.js Docs', url: 'https://nextjs.org/docs/app/api-reference/functions/revalidateTag' },
  ],
};
