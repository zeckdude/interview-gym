import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNjRenderingStrategies: Lesson = {
  id: 'lesson-nj-rendering-strategies',
  title: 'SSG vs SSR vs ISR vs PPR',
  category: 'nextjs',
  difficulty: 'intermediate',
  relatedChallengeIds: ['nj-03-static-dynamic-rendering', 'nj-08-dynamic-routes'],
  estimatedMinutes: 17,
  concepts: ['SSG', 'SSR', 'ISR', 'PPR', 'rendering strategies'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
Next.js gives you four rendering strategies that trade off **freshness** against **speed**:

- **SSG (Static Generation)** — HTML built once at deploy time, served identically to everyone from a CDN. Fastest possible, but frozen until the next deploy. Best for content that's the same for every visitor and rarely changes.

- **SSR (Server-Side Rendering)** — HTML generated fresh on **every request**. Always up to date, but pays a server round-trip each time. Best for personalized or highly dynamic content.

- **ISR (Incremental Static Regeneration)** — statically generated like SSG, but regenerated in the background after a \`revalidate\` window (or on-demand). Visitors get the fast, cached version while a fresh copy builds behind the scenes. Best for content that changes occasionally at scale.

- **PPR (Partial Prerendering)** — the newest option: a single route can mix a static shell with dynamic, per-request slices that stream in behind \`<Suspense>\` boundaries. This breaks the old "the whole page must pick ONE strategy" limitation.

**The framing that matters in interviews:** PPR isn't a fifth thing to choose *instead of* the others — it's a way to **compose** static and dynamic rendering within the same route.
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'typescript',
      content: `// SSG (default for a route with no dynamic data access)
export default async function AboutPage() {
  return <p>Static content, built once.</p>;
}

// SSR — force dynamic rendering on every request
export const dynamic = 'force-dynamic';

// ISR — statically generated, revalidated every 60 seconds
export const revalidate = 60;

// PPR — static shell + a dynamic slice that streams in
export default function ProductPage() {
  return (
    <>
      <ProductDetails /> {/* static */}
      <Suspense fallback={<Skeleton />}>
        <LiveInventoryCount /> {/* dynamic, streamed */}
      </Suspense>
    </>
  );
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**"Using \`fetch\` inside a component automatically makes the whole route dynamic."** Not by default — Next.js will try to statically render as much as possible. It's specific signals (\`cookies()\`, \`headers()\`, \`{ cache: 'no-store' }\`, \`export const dynamic = 'force-dynamic'\`) that opt a route into fully dynamic rendering. Without PPR, using even **one** of these anywhere in the route makes the **entire** route dynamic — which is exactly the all-or-nothing limitation PPR was built to solve.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-nj-rendering-strategies',
    prompt: `Implement chooseRenderingStrategy({ personalized, updateFrequencySeconds }) — return 'SSR' for personalized content, 'SSG' for content that never changes, and 'ISR' for shared content that updates on an interval.`,
    timeLimitSeconds: 150,
    starterCode: {
      javascript: `function chooseRenderingStrategy({ personalized, updateFrequencySeconds }) {
  
}`,
      typescript: `function chooseRenderingStrategy(config: {
  personalized: boolean;
  updateFrequencySeconds?: number;
}): 'SSR' | 'SSG' | 'ISR' {
  
}`,
    },
    solution: {
      javascript: `function chooseRenderingStrategy({ personalized, updateFrequencySeconds }) {
  if (personalized) return 'SSR';
  if (!updateFrequencySeconds || updateFrequencySeconds === Infinity) return 'SSG';
  return 'ISR';
}`,
      typescript: `function chooseRenderingStrategy(config: {
  personalized: boolean;
  updateFrequencySeconds?: number;
}): 'SSR' | 'SSG' | 'ISR' {
  const { personalized, updateFrequencySeconds } = config;
  if (personalized) return 'SSR';
  if (!updateFrequencySeconds || updateFrequencySeconds === Infinity) return 'SSG';
  return 'ISR';
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'chooseRenderingStrategy');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function(
          'chooseRenderingStrategy',
          `return Boolean(
            chooseRenderingStrategy({ personalized: true, updateFrequencySeconds: 60 }) === 'SSR' &&
            chooseRenderingStrategy({ personalized: false }) === 'SSG' &&
            chooseRenderingStrategy({ personalized: false, updateFrequencySeconds: 3600 }) === 'ISR'
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
    { label: 'Rendering — Next.js Docs', url: 'https://nextjs.org/docs/app/building-your-application/rendering' },
    { label: 'Partial Prerendering — Next.js Docs', url: 'https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering' },
  ],
};
