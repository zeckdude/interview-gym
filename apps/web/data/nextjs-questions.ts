import type { ConceptualQuestion } from './types';

export const nextjsQuestions: ConceptualQuestion[] = [
  {
    id: 'njq-01',
    category: 'nextjs-question',
    question:
      'What is the difference between Server Components and Client Components in the Next.js App Router? When would you reach for each one?',
    difficulty: 'easy',
    concepts: ['server components', 'client components', 'app router', 'rendering boundaries'],
    modelAnswer: `In the App Router, every component is a **Server Component** by default. Server Components render on the server (or at build time), never ship their JavaScript to the browser, and can directly access backend resources — databases, the filesystem, environment secrets — without an API layer.

**Client Components** are opted into with the \`'use client'\` directive at the top of a file. They render on the server for the initial HTML too, but their JavaScript is also sent to the browser so they can hydrate and become interactive. Anything that needs state, effects, event handlers, or browser-only APIs (\`useState\`, \`useEffect\`, \`onClick\`, \`window\`, \`localStorage\`) must be a Client Component.

**When to use each:**
- **Server Components** — data fetching, static content, anything that doesn't need interactivity (layouts, headers, markdown rendering, database queries).
- **Client Components** — forms, dropdowns, modals, anything with local state or browser APIs.

**Key mental model:** the \`'use client'\` boundary marks the *start* of a client subtree — everything imported underneath it also ships to the browser, even if those child files don't have their own directive. The best pattern is to push \`'use client'\` as far down the tree as possible (a small interactive leaf component) and keep everything above it as Server Components to minimize the client JS bundle.

Server Components also can't use hooks, can't have event handlers, and can't use browser-only APIs, but they CAN be async and use \`await\` directly for data fetching.`,
    keyTerms: [
      "'use client'",
      'server component',
      'client component',
      'hydration',
      'bundle size',
      'app router',
      'interactivity',
    ],
    passingThreshold: 0.5,
    mostAsked: true,
  },
  {
    id: 'njq-02',
    category: 'nextjs-question',
    question:
      'Next.js has multiple caching layers. Name them and explain what each one caches and how you would opt out of or invalidate it.',
    difficulty: 'intermediate',
    concepts: ['caching', 'fetch cache', 'full route cache', 'router cache', 'data cache', 'revalidation'],
    modelAnswer: `Next.js (App Router) has **four distinct caching layers**, and confusing them is one of the most common sources of "why isn't my data updating?" bugs:

1. **Request Memoization** — within a single render pass, identical \`fetch()\` calls (same URL + options) are automatically deduped and memoized. This is per-request only and resets on every new request; it can't be manually invalidated because it doesn't persist.

2. **Data Cache** — a persistent server-side cache for \`fetch()\` results, shared across requests and deployments. Controlled with \`fetch(url, { cache: 'force-cache' | 'no-store' })\` or \`{ next: { revalidate: seconds } }\`. Invalidate with \`revalidateTag()\` / \`revalidatePath()\` or by setting a shorter \`revalidate\` window.

3. **Full Route Cache** — Next.js caches the rendered HTML + RSC payload for statically rendered routes at build time. This is what makes static pages fast without hitting the server at all. It's invalidated when you redeploy, call \`revalidatePath\`, or when the route opts into dynamic rendering.

4. **Router Cache (Client-side Router Cache)** — an in-memory client-side cache of RSC payloads for pages you've already visited, so back/forward navigation is instant. It's tied to the session and is invalidated by a full page reload, \`router.refresh()\`, or (in older versions) time-based expiration.

**Opting out:** use \`fetch(url, { cache: 'no-store' })\` for a single request, or \`export const dynamic = 'force-dynamic'\` to opt an entire route out of the Full Route Cache. To invalidate on-demand after a mutation, call \`revalidateTag('tag-name')\` or \`revalidatePath('/path')\` inside a Server Action or Route Handler.

The trap interviewers probe for: people assume "no cache config = always fresh," when the default for \`fetch\` in a Server Component is actually cached indefinitely unless you specify otherwise.`,
    keyTerms: [
      'data cache',
      'full route cache',
      'router cache',
      'request memoization',
      'revalidateTag',
      'revalidatePath',
      'force-dynamic',
      'no-store',
    ],
    passingThreshold: 0.5,
    mostAsked: true,
  },
  {
    id: 'njq-03',
    category: 'nextjs-question',
    question:
      'What are Server Actions? Walk through how you would use one to handle a form submission, including error handling and cache revalidation.',
    difficulty: 'intermediate',
    concepts: ['server actions', 'mutations', 'progressive enhancement', 'revalidation', 'form handling'],
    modelAnswer: `**Server Actions** are async functions marked with \`'use server'\` that run exclusively on the server but can be called directly from Client (or Server) Components — no manually-written API route required. Next.js generates a secure endpoint under the hood and handles the network call for you.

**Basic pattern:**

\`\`\`ts
// actions.ts
'use server';
export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  if (!title) return { error: 'Title is required' };
  await db.post.create({ data: { title } });
  revalidatePath('/posts');
}
\`\`\`

\`\`\`tsx
// form component
<form action={createPost}>
  <input name="title" />
  <button type="submit">Create</button>
</form>
\`\`\`

Because the \`action\` prop accepts a Server Action directly, the form works even **before JavaScript loads** (progressive enhancement) — the browser does a native form POST that Next.js intercepts.

**Error handling:** Server Actions can return a serializable value (e.g. \`{ error: string }\`) that the calling component reads via \`useActionState\` (formerly \`useFormState\`) to render validation messages, or you can \`throw\` to trigger the nearest \`error.tsx\` boundary for unexpected failures.

**Pending state:** \`useFormStatus\` gives you \`pending\` inside a child of the form to show a loading spinner without prop drilling.

**Cache revalidation:** after a mutation, you must explicitly call \`revalidatePath('/posts')\` or \`revalidateTag('posts')\` inside the action — Next.js does NOT automatically know your database changed, so without this the Full Route Cache and Data Cache would keep serving stale data.

**Security note:** Server Actions are still public HTTP endpoints under the hood — always re-validate auth/permissions inside the action itself, never trust that "it's only called from this form" is a security boundary.`,
    keyTerms: [
      "'use server'",
      'server action',
      'formData',
      'revalidatePath',
      'revalidateTag',
      'useActionState',
      'useFormStatus',
      'progressive enhancement',
    ],
    passingThreshold: 0.5,
    mostAsked: true,
  },
  {
    id: 'njq-04',
    category: 'nextjs-question',
    question:
      'What is Next.js middleware and what are its main constraints? Give a couple of real-world use cases.',
    difficulty: 'intermediate',
    concepts: ['middleware', 'edge runtime', 'request interception', 'redirects', 'rewrites'],
    modelAnswer: `**Middleware** in Next.js (\`middleware.ts\` at the project root) runs on **every matching request**, before it reaches a route, cache, or page. It intercepts the request and can inspect/modify it, redirect, rewrite, set headers/cookies, or pass it through.

**Key constraints:**
- Runs on the **Edge Runtime** by default — a stripped-down JS runtime (V8 isolates, not Node.js). This means **no Node.js APIs** (no \`fs\`, no most native npm packages, limited \`Buffer\` support).
- Must be fast — it runs on every request, so heavy computation or slow network calls will add latency to your whole site.
- Can read/write cookies and headers, and read the request URL, but cannot directly query most traditional databases (some edge-compatible drivers exist, e.g. edge-compatible Postgres clients).
- Configured with a \`matcher\` config export to scope which paths it runs on — running it on every single asset request is wasteful.

**Real-world use cases:**
1. **Auth gating** — check for a session cookie/JWT and redirect unauthenticated users to \`/sign-in\` before they ever reach a protected page.
2. **A/B testing & feature flags** — read a cookie or header and rewrite the request to a different variant of a page without changing the URL the user sees.
3. **Geolocation-based redirects** — redirect users to a locale-specific path based on \`request.geo\` or the \`Accept-Language\` header.
4. **Bot/security filtering** — block or rate-limit requests matching suspicious patterns before they hit application code.

\`\`\`ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('session');
  if (!token) return NextResponse.redirect(new URL('/sign-in', request.url));
  return NextResponse.next();
}
export const config = { matcher: ['/dashboard/:path*'] };
\`\`\`

The common interview trap: candidates forget that middleware runs on the Edge Runtime and try to use Node-only APIs or a standard Prisma client inside it, which will fail at build or runtime.`,
    keyTerms: [
      'middleware',
      'edge runtime',
      'matcher',
      'NextResponse',
      'redirect',
      'rewrite',
      'cookies',
      'auth gating',
    ],
    passingThreshold: 0.5,
    mostAsked: true,
  },
  {
    id: 'njq-05',
    category: 'nextjs-question',
    question:
      'What does generateStaticParams do, and how does it interact with dynamic route segments at build time versus request time?',
    difficulty: 'intermediate',
    concepts: ['generateStaticParams', 'dynamic routes', 'static generation', 'dynamicParams'],
    modelAnswer: `\`generateStaticParams\` is a function you export from a dynamic route segment (e.g. \`app/blog/[slug]/page.tsx\`) that tells Next.js **which param values to pre-render at build time**, turning a dynamic route into a statically generated one for those specific values.

\`\`\`ts
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
\`\`\`

For each object returned, Next.js generates a static HTML page and RSC payload at **build time**, so those pages are served instantly from the cache/CDN with no server render on request — equivalent to \`getStaticPaths\` in the old Pages Router.

**What happens for params NOT returned:** this is controlled by the \`dynamicParams\` export (defaults to \`true\`):
- \`dynamicParams = true\` (default) — visiting a slug that wasn't pre-generated triggers an **on-demand render at request time**, and (in production) the result is cached for subsequent visitors — effectively lazy static generation.
- \`dynamicParams = false\` — any param not returned by \`generateStaticParams\` results in a **404**, useful when you want a strict allowlist (e.g. only published posts should ever be reachable).

**Nested dynamic segments:** if you have multiple dynamic segments (\`[category]/[slug]\`), \`generateStaticParams\` can be defined per-segment and Next.js will generate the full cartesian combination, or a parent segment's function can return all needed params for children to consume via \`generateStaticParams\`'s arguments.

This is commonly paired with **ISR** (\`export const revalidate = 3600\`) so pre-rendered pages stay static but periodically refresh in the background rather than being frozen forever.`,
    keyTerms: [
      'generateStaticParams',
      'dynamic route',
      'dynamicParams',
      'build time',
      'static generation',
      'ISR',
      '404',
    ],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'njq-06',
    category: 'nextjs-question',
    question:
      'How would you architect authentication in a Next.js App Router application? Where do you check the session, and how do you protect both pages and API routes?',
    difficulty: 'intermediate',
    concepts: ['auth architecture', 'session', 'middleware', 'server components', 'route handlers'],
    modelAnswer: `A robust Next.js auth architecture layers checks at **multiple levels** because no single layer is fully sufficient on its own — this is "defense in depth" applied to routing.

**1. Middleware (coarse-grained gate)** — runs first on every matching request. Reads a session cookie/JWT and redirects unauthenticated users away from protected route groups (e.g. \`/dashboard/*\`) before any rendering work happens. This is fast but shouldn't be the *only* check, since middleware can be bypassed by directly hitting a Route Handler or by misconfigured matchers.

**2. Server Components (data-level gate)** — in layouts or pages themselves, re-verify the session (e.g. via a \`getServerSession()\` / \`auth()\` helper reading cookies) before fetching or rendering sensitive data. This is the authoritative check — never trust that middleware alone protected the route, because Server Components can be reached via direct navigation, prefetching, or partial rendering paths.

**3. Route Handlers & Server Actions (mutation-level gate)** — every Route Handler and Server Action must independently re-check auth and authorization (not just "is logged in" but "is this user allowed to modify this resource"), since these are effectively public HTTP endpoints regardless of what UI calls them.

**Session storage:** typically an HTTP-only, secure, signed cookie holding a session ID or JWT, so it's inaccessible to client-side JavaScript (mitigating XSS token theft). Session validation logic is usually centralized in one shared utility (e.g. \`lib/auth.ts\`) imported everywhere rather than duplicated.

**Common tools:** libraries like Clerk, Auth.js (NextAuth), or a custom JWT/cookie scheme integrate with middleware via \`authMiddleware\`/\`clerkMiddleware\` helpers, plus server-side helpers (\`auth()\`, \`currentUser()\`) for use inside Server Components and Route Handlers.

The interview trap: candidates protect the UI (hide a "Delete" button) but forget to re-check permissions in the Server Action itself, leaving the mutation exploitable via direct request.`,
    keyTerms: [
      'middleware',
      'session',
      'cookie',
      'server component',
      'route handler',
      'server action',
      'authorization',
      'defense in depth',
    ],
    passingThreshold: 0.5,
    mostAsked: true,
  },
  {
    id: 'njq-07',
    category: 'nextjs-question',
    question:
      'Explain the differences between SSG, SSR, ISR, and PPR. When would you choose each rendering strategy?',
    difficulty: 'advanced',
    concepts: ['SSG', 'SSR', 'ISR', 'PPR', 'rendering strategies'],
    modelAnswer: `Next.js supports four rendering strategies that trade off freshness, performance, and infrastructure cost differently:

**SSG (Static Site Generation)** — HTML is generated once at **build time** and served identically to every visitor from a CDN, with no per-request server work. Fastest possible response, but content is frozen until the next deploy. Best for marketing pages, docs, blog posts that rarely change.

**SSR (Server-Side Rendering)** — HTML is generated **on every request**, on the server, always reflecting the latest data. Slower than SSG (server round-trip per request) but guarantees freshness. Best for personalized or highly dynamic content (a logged-in dashboard, search results).

**ISR (Incremental Static Regeneration)** — a hybrid: pages are statically generated like SSG, but Next.js will regenerate them in the background after a \`revalidate\` window expires (or on-demand via \`revalidatePath\`/\`revalidateTag\`), serving the stale version instantly while the fresh one regenerates. Best for content that changes occasionally (product pages, articles) where near-real-time freshness isn't required but you don't want a full rebuild for every edit.

**PPR (Partial Prerendering)** — the newest strategy: a **single route can mix static and dynamic content**. Next.js prerenders a static "shell" (instantly served from the edge) with \`<Suspense>\` boundaries around dynamic, per-request pieces that stream in afterward. This eliminates the old all-or-nothing choice between "the whole page is static" or "the whole page is dynamic" — e.g. a product page's layout/description can be static while the "live inventory count" or "personalized recommendations" stream in dynamically, all from one route with one deployment artifact.

**Choosing:**
- Rarely-changing, same-for-everyone content → **SSG**
- Always-fresh, personalized-per-request content → **SSR**
- Occasionally-changing, same-for-everyone content at scale → **ISR**
- A page that's *mostly* static but has a few genuinely dynamic slices → **PPR**

The advanced framing interviewers look for: PPR isn't "a fifth option to pick instead of the other three" — it's a way to compose static and dynamic rendering *within the same route* instead of being forced to choose one strategy for the entire page.`,
    keyTerms: [
      'SSG',
      'SSR',
      'ISR',
      'PPR',
      'static generation',
      'revalidate',
      'suspense',
      'partial prerendering',
      'streaming',
    ],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'njq-08',
    category: 'nextjs-question',
    question:
      'What problems does the next/image component solve compared to a plain <img> tag, and what props matter most for performance?',
    difficulty: 'easy',
    concepts: ['next/image', 'image optimization', 'lazy loading', 'layout shift'],
    modelAnswer: `The \`next/image\` component automatically solves several performance and UX problems that a raw \`<img>\` tag leaves entirely to the developer:

1. **Automatic resizing & format conversion** — serves appropriately sized images per device/viewport and converts to modern formats (WebP/AVIF) when the browser supports them, without you generating multiple files manually.

2. **Lazy loading by default** — images outside the viewport aren't fetched until the user scrolls near them, reducing initial page weight. This can be disabled with \`priority\` for above-the-fold images that should load immediately.

3. **Layout shift prevention** — by requiring (or inferring) \`width\`/\`height\` (or using \`fill\` with a sized parent), Next.js reserves the correct space in the layout before the image loads, preventing Cumulative Layout Shift (CLS) — a Core Web Vital.

4. **Responsive \`srcset\` generation** — automatically generates a \`srcset\` so the browser picks the right resolution for the device's screen density and viewport width.

**Props that matter most:**
- \`width\` / \`height\` (or \`fill\`) — required for layout stability.
- \`priority\` — set on the Largest Contentful Paint (LCP) image (e.g. a hero image) to skip lazy loading and preload it, directly improving LCP score.
- \`sizes\` — tells the browser how much viewport width the image will occupy at different breakpoints, so it downloads the right \`srcset\` candidate instead of the largest one.
- \`quality\` — trade-off knob between file size and visual fidelity (default 75).
- \`placeholder="blur"\` — shows a low-quality blurred preview while the full image loads, improving perceived performance.

The interview trap: forgetting that \`next/image\` needs a configured loader/domain allowlist (\`next.config.js\` \`images.remotePatterns\`) for external image URLs, or misusing \`fill\` without a positioned parent container.`,
    keyTerms: [
      'next/image',
      'lazy loading',
      'layout shift',
      'CLS',
      'priority',
      'srcset',
      'width',
      'height',
      'LCP',
    ],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'njq-09',
    category: 'nextjs-question',
    question:
      'What causes a hydration mismatch error in Next.js, and how do you debug and fix one?',
    difficulty: 'intermediate',
    concepts: ['hydration', 'hydration mismatch', 'server-client rendering divergence'],
    modelAnswer: `A **hydration mismatch** happens when the HTML React generates on the server doesn't match what it generates on the client during the initial hydration pass. React expects them to be identical so it can attach event listeners to existing DOM nodes; when they diverge, React either throws a warning/error and re-renders the mismatched subtree on the client, or (in dev) surfaces a visible error overlay.

**Common causes:**
1. **Browser-only APIs used during render** — reading \`window\`, \`localStorage\`, or \`navigator\` directly in the render body produces different output server-side (where these don't exist) vs. client-side.
2. **Non-deterministic values** — \`Date.now()\`, \`Math.random()\`, or \`new Date().toLocaleString()\` (timezone-dependent) rendered directly will differ between server render time and client hydration time.
3. **Invalid HTML nesting** — e.g. a \`<div>\` inside a \`<p>\`; the browser silently "corrects" the HTML structure during parsing, which no longer matches React's expected tree.
4. **Browser extensions** mutating the DOM before React hydrates (a false positive — not actually your bug, but a common gotcha to recognize).
5. **Conditional rendering based on \`typeof window !== 'undefined'\`** without properly deferring to an effect.

**How to debug:** the dev-mode error overlay usually pinpoints the exact DOM node and attribute that differs. Cross-reference: is this value derived from something environment-dependent (time, random, browser API)?

**How to fix:**
- Move browser-only reads into \`useEffect\` and store the result in state, so the first render (server + initial client) matches, then a second client-only render updates it.
- Use the \`suppressHydrationWarning\` prop as a last resort for genuinely-expected mismatches (e.g. a rendered timestamp), applied to the specific element only.
- Fix invalid HTML nesting.
- For "only render on client" cases, use a mounted-state pattern: \`const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), [])\` and render a placeholder until \`mounted\` is true.`,
    keyTerms: [
      'hydration',
      'hydration mismatch',
      'useEffect',
      'suppressHydrationWarning',
      'window',
      'Date.now',
      'server render',
      'client render',
    ],
    passingThreshold: 0.5,
    mostAsked: true,
  },
  {
    id: 'njq-10',
    category: 'nextjs-question',
    question:
      'How do you implement optimistic updates with Server Actions using useOptimistic? Walk through the flow and failure handling.',
    difficulty: 'intermediate',
    concepts: ['optimistic updates', 'useOptimistic', 'server actions', 'rollback'],
    modelAnswer: `\`useOptimistic\` is a React hook (used heavily alongside Server Actions in Next.js) that lets you show an **immediate, "optimistic" UI update** while the real mutation is still in flight on the server, then reconciles with the true result once it resolves.

**Flow:**

\`\`\`tsx
function TodoList({ todos, addTodoAction }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, { ...newTodo, pending: true }]
  );

  async function formAction(formData: FormData) {
    const text = formData.get('text') as string;
    addOptimisticTodo({ id: crypto.randomUUID(), text });
    await addTodoAction(formData); // the real Server Action
  }

  return (
    <form action={formAction}>
      {optimisticTodos.map((t) => (
        <li key={t.id} style={{ opacity: t.pending ? 0.5 : 1 }}>{t.text}</li>
      ))}
      <input name="text" />
    </form>
  );
}
\`\`\`

1. \`useOptimistic(state, updateFn)\` takes the "real" state (from props, usually server-fetched) and an updater function.
2. Calling the returned setter (\`addOptimisticTodo\`) immediately re-renders with the optimistic value merged in — the user sees instant feedback.
3. Meanwhile the actual Server Action runs. When it resolves and the parent's real \`todos\` prop updates (e.g. via revalidation), React reconciles: the optimistic entry is replaced by the real, persisted data.

**Failure handling:** if the Server Action throws or returns an error, the optimistic state is **not automatically rolled back** by React — you're responsible for surfacing the error (e.g. via \`useActionState\`) and either removing the optimistic item or showing an inline "failed to save, retry?" state. A common pattern is wrapping the action call in try/catch and setting local error state to revert the UI, since \`useOptimistic\`'s state resets automatically once the underlying data changes (or a re-render occurs without a pending optimistic update).

The key trade-off: better perceived performance vs. added complexity for handling the failure/rollback path correctly.`,
    keyTerms: [
      'useOptimistic',
      'optimistic update',
      'server action',
      'rollback',
      'useActionState',
      'pending state',
      'reconciliation',
    ],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'njq-11',
    category: 'nextjs-question',
    question:
      'What are parallel routes and intercepting routes in the App Router? Give an example of a real UI pattern each one enables.',
    difficulty: 'advanced',
    concepts: ['parallel routes', 'intercepting routes', 'app router', 'modals', 'slots'],
    modelAnswer: `**Parallel routes** let you render **multiple independent pages in the same layout simultaneously**, each with its own loading/error state and independent navigation. They're defined with named "slots" using the \`@folder\` convention (e.g. \`@team\`, \`@analytics\`) and consumed as props in the parent \`layout.tsx\`.

\`\`\`
app/
  dashboard/
    @team/page.tsx
    @analytics/page.tsx
    layout.tsx   // receives { children, team, analytics } props
\`\`\`

This enables patterns like a dashboard with independently-loading widgets (each slot streams in on its own, with its own \`loading.tsx\`), or conditionally rendering different content in the same slot based on role/state — without one slow section blocking the rest of the page.

**Intercepting routes** let you "intercept" a navigation to render a route in the context of the current page (e.g. as a modal overlay) instead of fully navigating away — while a **direct visit or refresh** to that same URL still renders the full, standalone page. Denoted with \`(..)\`, \`(.)\`, \`(..)(..)\`, or \`(...)\` prefixes indicating how many segment levels to match against.

\`\`\`
app/
  feed/page.tsx
  @modal/(.)photo/[id]/page.tsx   // intercepted: shows as modal from feed
  photo/[id]/page.tsx             // full page: shown on direct visit/refresh
\`\`\`

**Real UI pattern:** the classic example is Instagram/Twitter-style photo modals — clicking a photo thumbnail from a feed opens it as a modal overlay (soft navigation via intercepting route + parallel route slot), preserving the feed scroll position underneath, but sharing/refreshing that same URL loads the photo as its own full standalone page (SEO-friendly, shareable link) using the non-intercepted route.

These two features are almost always used **together**: the parallel route provides the \`@modal\` slot to render into, and the intercepting route decides whether that slot shows the modal version or falls through to the full page.`,
    keyTerms: [
      'parallel routes',
      'intercepting routes',
      '@modal',
      'slot',
      'default.tsx',
      'soft navigation',
      'layout.tsx',
    ],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'njq-12',
    category: 'nextjs-question',
    question:
      'How does Next.js handle environment variables, and what is the difference between server-only and NEXT_PUBLIC_-prefixed variables?',
    difficulty: 'easy',
    concepts: ['environment variables', 'NEXT_PUBLIC_', 'build time', 'secrets'],
    modelAnswer: `Next.js loads environment variables from \`.env\`, \`.env.local\`, \`.env.production\`, etc. (with a defined precedence order) and makes them available via \`process.env\` — but **where** they're accessible depends on naming.

**Server-only variables** (no special prefix, e.g. \`DATABASE_URL\`) are only available in server-side code: Server Components, Route Handlers, Server Actions, \`getServerSideProps\`/\`generateMetadata\`, and \`next.config.js\`. They are **never** bundled into client-side JavaScript, which is exactly what you want for secrets like API keys and database credentials — if they leaked into the client bundle, anyone could read them from browser devtools.

**\`NEXT_PUBLIC_\`-prefixed variables** (e.g. \`NEXT_PUBLIC_ANALYTICS_ID\`) are **inlined directly into the client JavaScript bundle at build time**. Next.js does a literal string replacement wherever \`process.env.NEXT_PUBLIC_X\` appears in client code, so these values are visible to anyone inspecting the bundle — appropriate only for genuinely public values (a public API base URL, a public analytics/tracking ID), never secrets.

**Key gotchas:**
- Because \`NEXT_PUBLIC_\` inlining happens at **build time**, changing the value requires a rebuild — setting it at runtime in a deployed container has no effect on already-built client bundles.
- Referencing \`process.env.SOME_VAR\` in a Client Component (without the prefix) will just be \`undefined\` in the browser — Next.js only inlines exact, statically-analyzable \`process.env.NEXT_PUBLIC_*\` references, not dynamic ones like \`process.env[key]\`.
- \`.env.local\` is gitignored by default and meant for local secrets/overrides; \`.env\` (no suffix) is typically committed with safe defaults.

The interview trap: assuming any environment variable is automatically "just available" everywhere, when really the client/server boundary and the \`NEXT_PUBLIC_\` prefix are the entire access-control mechanism.`,
    keyTerms: [
      'NEXT_PUBLIC_',
      'environment variable',
      'process.env',
      'build time',
      'client bundle',
      'secrets',
      '.env.local',
    ],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'njq-13',
    category: 'nextjs-question',
    question:
      'A Next.js page is loading slowly. Walk through how you would systematically debug and diagnose the performance problem.',
    difficulty: 'intermediate',
    concepts: ['performance debugging', 'core web vitals', 'profiling', 'bundle analysis'],
    modelAnswer: `A systematic performance debugging pass moves from **measurement** to **hypothesis** to **fix**, rather than guessing:

**1. Measure first.** Run Lighthouse / PageSpeed Insights (or check real-user Core Web Vitals in Vercel Analytics / a monitoring tool) to identify which metric is actually bad: LCP (Largest Contentful Paint), TTFB (Time to First Byte), CLS (layout shift), or INP (Interaction to Next Paint). Each points to a different root cause.

**2. Diagnose by metric:**
- **High TTFB** → server-side bottleneck: slow data fetching (no caching, N+1 database queries, unindexed queries, waiting on a slow third-party API), or the route is unnecessarily fully dynamic when it could be static/ISR.
- **High LCP** → the largest visible element (often a hero image or heading) is loading late — check if it's using \`next/image\` with \`priority\`, whether critical CSS/fonts block render, or whether TTFB itself is the upstream cause.
- **High CLS** → images/embeds without reserved dimensions, web fonts causing a layout jump (mitigate with \`next/font\`'s automatic font optimization and \`font-display\`), or dynamically injected content shifting layout.
- **High INP / slow interactivity** → too much client-side JavaScript: check if Server Components could replace some Client Components, whether a huge Client Component boundary can be split with smaller \`'use client'\` leaves, or whether an expensive computation should be memoized.

**3. Inspect the bundle.** Use \`@next/bundle-analyzer\` to see what's actually shipped to the client — large third-party libraries, duplicate dependencies, or Client Components importing more than they need are common culprits. Dynamic \`import()\` with \`next/dynamic\` can defer non-critical code.

**4. Check caching.** Confirm whether \`fetch\` calls are using the Data Cache appropriately (or fetching sequentially instead of in parallel with \`Promise.all\`), and whether the route is statically rendered when it could be.

**5. Verify with the Network/Performance tabs** in devtools and re-run Lighthouse after each fix to confirm the metric actually improved — performance work should be data-driven at every step, not just "feels faster."`,
    keyTerms: [
      'LCP',
      'TTFB',
      'CLS',
      'INP',
      'lighthouse',
      'bundle analyzer',
      'next/dynamic',
      'core web vitals',
      'caching',
    ],
    passingThreshold: 0.5,
    mostAsked: true,
  },
  {
    id: 'njq-14',
    category: 'nextjs-question',
    question:
      'What is the Edge Runtime in Next.js, how does it differ from the Node.js runtime, and when should you choose it?',
    difficulty: 'advanced',
    concepts: ['edge runtime', 'node.js runtime', 'V8 isolates', 'cold starts'],
    modelAnswer: `Next.js can execute server-side code (middleware, Route Handlers, and some rendering) on one of two runtimes:

**Node.js Runtime** — the full Node.js environment: complete access to Node APIs (\`fs\`, \`net\`, native npm modules, full \`Buffer\`/\`crypto\`), runs in a traditional serverless function/container. Higher cold-start latency but maximum compatibility — most database drivers, ORMs, and existing npm packages assume this runtime.

**Edge Runtime** — a minimal JavaScript runtime built on **V8 isolates** (the same underlying tech as Cloudflare Workers), a strict subset of Web APIs (\`fetch\`, \`Request\`/\`Response\`, \`crypto.subtle\`, streams) with **no Node.js-specific APIs**. Isolates start near-instantly (no full container boot), so cold starts are dramatically reduced, and code runs geographically distributed closer to the user at edge locations, lowering latency for globally distributed traffic.

**Key differences:**
| | Node.js Runtime | Edge Runtime |
|---|---|---|
| Cold start | Slower (100s of ms+) | Near-instant |
| Node APIs (\`fs\`, native modules) | ✅ Full support | ❌ Not available |
| Execution location | Fewer regions | Distributed at the edge |
| Memory/CPU limits | Higher | Lower, stricter |
| Compatible packages | Almost everything | Only Edge-compatible / Web-standard packages |

**When to choose Edge:** middleware (which *must* run on Edge), latency-sensitive logic that needs to run close to users globally (auth checks, redirects, A/B test bucketing, geolocation-based logic), and simple Route Handlers that only need \`fetch\`-based data access (e.g. calling an edge-compatible database like a serverless Postgres driver over HTTP, or a KV store).

**When to avoid Edge:** anything needing Node-only npm packages (many ORMs, image processing libraries, certain auth libraries), heavier compute, or long-running/streaming work beyond the Edge Runtime's stricter execution limits.

The advanced framing: Edge isn't strictly "better" — it's a different set of trade-offs (compatibility and compute power vs. latency and cold-start), and the runtime is declared per Route Handler/page via \`export const runtime = 'edge'\`.`,
    keyTerms: [
      'edge runtime',
      'node.js runtime',
      'V8 isolates',
      'cold start',
      'middleware',
      'runtime = edge',
      'Web APIs',
    ],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'njq-15',
    category: 'nextjs-question',
    question:
      'What CSS options are available in Next.js (CSS Modules, Tailwind, CSS-in-JS, global CSS) and what are the trade-offs of each with Server Components?',
    difficulty: 'easy',
    concepts: ['css modules', 'tailwind', 'css-in-js', 'global css', 'server components'],
    modelAnswer: `Next.js supports several CSS strategies, each with different trade-offs — especially now that Server Components are the default and don't support the runtime style-injection some older CSS-in-JS libraries relied on.

**Global CSS** — a single \`app/globals.css\` imported once in the root layout. Simple, zero-config, good for resets, design tokens/CSS variables, and truly global styles. Downside: no scoping, so class name collisions are possible at scale.

**CSS Modules** (\`Component.module.css\`) — locally-scoped class names generated at build time (e.g. \`.button_kx8f2\`), imported directly into any component including Server Components. Zero runtime cost, works everywhere, and is the safest default for component-scoped styles without adopting a whole framework.

**Tailwind CSS** — utility-first classes applied directly in JSX. Fully compatible with Server Components (it's just static class strings compiled at build time by the Tailwind/PostCSS pipeline, no client runtime needed), colocates styling with markup, and produces a single small, tree-shaken CSS file via its JIT compiler. This is the most common modern choice for new Next.js apps.

**CSS-in-JS (styled-components, Emotion, etc.)** — historically popular, but many CSS-in-JS libraries rely on a **runtime** that injects \`<style>\` tags during React rendering, which conflicts with Server Components (which can't use client-side effects/context the way these libraries traditionally worked) and can cause flash-of-unstyled-content or require heavier configuration/babel plugins to work with the App Router at all. Some libraries have added App Router-compatible adapters, but overall this category has the roughest edges in the Server Components world today.

**Trade-off summary for Server Components specifically:**
- **CSS Modules & Tailwind** — work seamlessly, zero runtime overhead, no extra configuration for RSC compatibility.
- **Global CSS** — works fine but doesn't scale well for large component libraries.
- **Runtime CSS-in-JS** — needs explicit RSC-compatible adapters/registries and generally adds complexity that's no longer necessary given how well Tailwind and CSS Modules now work.

Given this, most new Next.js projects reach for **Tailwind** (utility velocity) or **CSS Modules** (scoped, zero-dependency) rather than traditional CSS-in-JS.`,
    keyTerms: [
      'css modules',
      'tailwind',
      'css-in-js',
      'global css',
      'server components',
      'scoped styles',
      'runtime style injection',
    ],
    passingThreshold: 0.5,
    mostAsked: false,
  },
];
