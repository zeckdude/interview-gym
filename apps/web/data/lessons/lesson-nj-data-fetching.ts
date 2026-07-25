import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNjDataFetching: Lesson = {
  id: 'lesson-nj-data-fetching',
  title: 'Data Fetching Patterns in Next.js',
  category: 'nextjs',
  difficulty: 'intermediate',
  relatedChallengeIds: ['nj-10-data-fetching-patterns', 'nj-13-streaming-suspense'],
  estimatedMinutes: 16,
  concepts: ['async server components', 'parallel fetching', 'request waterfalls', 'streaming', 'suspense'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
Server Components can be \`async\` and \`await\` data **directly in the component body** — no \`useEffect\`, no loading state boilerplate for the initial render.

**The trap this unlocks:** if one component awaits a fetch, and its *child* also awaits a fetch, and neither request needs the other's result, you've accidentally created a **request waterfall** — request B doesn't even start until request A finishes, even though they could have run at the same time.

**Fix it with parallel fetching:** kick off all independent requests *before* awaiting any of them, then await together:

- Sequential (bad): \`const user = await getUser(); const posts = await getPosts();\`
- Parallel (good): \`const [user, posts] = await Promise.all([getUser(), getPosts()]);\`

**Streaming with Suspense:** wrap slow, independent sections in \`<Suspense fallback={...}>\` so the fast parts of the page can render immediately while the slow parts stream in afterward — instead of the whole page waiting on the single slowest request.
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'typescript',
      content: `// Sequential — creates a waterfall (posts wait for user, unnecessarily)
async function BadPage() {
  const user = await getUser();
  const posts = await getPosts();
  return <Profile user={user} posts={posts} />;
}

// Parallel — both requests fire immediately
async function GoodPage() {
  const [user, posts] = await Promise.all([getUser(), getPosts()]);
  return <Profile user={user} posts={posts} />;
}

// Streaming — the slow section doesn't block the fast one
function StreamedPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<Spinner />}>
        <SlowRecommendations />
      </Suspense>
    </>
  );
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**"Awaiting early is always fine because it's just async/await."** The problem isn't \`await\` itself — it's *when* the request is initiated. \`await fetch(a); await fetch(b);\` doesn't start \`b\` until \`a\` resolves. Assign both fetch **promises** to variables first (which starts the network calls immediately), and only \`await\` them when you actually need the values.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-nj-data-fetching',
    prompt: `Implement isWaterfall(calls) — given a list of { start, end } timings for fetch calls, return true if the calls ran strictly sequentially (a waterfall) rather than overlapping in parallel.`,
    timeLimitSeconds: 150,
    starterCode: {
      javascript: `function isWaterfall(calls) {
  
}`,
      typescript: `function isWaterfall(calls: { start: number; end: number }[]): boolean {
  
}`,
    },
    solution: {
      javascript: `function isWaterfall(calls) {
  if (calls.length < 2) return false;
  const sorted = [...calls].sort((a, b) => a.start - b.start);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].start < sorted[i - 1].end) return false;
  }
  return true;
}`,
      typescript: `function isWaterfall(calls: { start: number; end: number }[]): boolean {
  if (calls.length < 2) return false;
  const sorted = [...calls].sort((a, b) => a.start - b.start);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].start < sorted[i - 1].end) return false;
  }
  return true;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'isWaterfall');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function(
          'isWaterfall',
          `return Boolean(
            isWaterfall([{ start: 0, end: 100 }, { start: 100, end: 250 }, { start: 250, end: 400 }]) === true &&
            isWaterfall([{ start: 0, end: 100 }, { start: 0, end: 150 }, { start: 5, end: 120 }]) === false &&
            isWaterfall([{ start: 0, end: 100 }]) === false
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
    { label: 'Fetching Data — Next.js Docs', url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/fetching' },
    { label: 'Loading UI and Streaming — Next.js Docs', url: 'https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming' },
  ],
};
