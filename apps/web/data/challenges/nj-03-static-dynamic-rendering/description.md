# Static vs Dynamic Rendering

## What You're Building

Next.js decides, per-route, whether to render pages **once at build time** (static) or **on every request** (dynamic). Implement `determineRenderMode()`, a simplified model of the real decision Next.js makes when it compiles your app.

## Requirements

- `determineRenderMode(config)` returns `'static'` or `'dynamic'`
- `dynamic: 'force-static'` always wins — the route is static no matter what else it does
- `dynamic: 'force-dynamic'` always wins the other way — the route is always dynamic
- Otherwise (`dynamic: 'auto'` or unset), the route becomes **dynamic** if it:
  - reads `cookies()` or `headers()`
  - reads `searchParams`
  - has `fetchCache: 'no-store'`
  - has `revalidate: 0`
- If none of the above apply, the route is **static** (this includes routes with `revalidate: 60` — that's ISR, still static with periodic regeneration)

> **Expected Output**
>
> A route with no dynamic APIs and no config → `'static'`. A route that calls `cookies()` → `'dynamic'`, even with no other config.

## Example

```ts
determineRenderMode({});                                  // 'static'
determineRenderMode({ usesCookies: true });                // 'dynamic'
determineRenderMode({ dynamic: 'force-dynamic' });          // 'dynamic'
determineRenderMode({ dynamic: 'force-static', usesCookies: true }); // 'static' (forced)
determineRenderMode({ revalidate: 60 });                    // 'static' (ISR)
```

## Why This Comes Up in Interviews

"Why is my page suddenly dynamic?" is one of the most common real-world Next.js bugs — usually caused by an innocent `cookies()` or `headers()` call deep in a component tree. Interviewers use this to test whether you know what actually forces the opt-out of static rendering.

## What You Need to Know

- Static rendering happens at **build time** (or once, then cached) — fastest, cacheable, works great on a CDN
- Dynamic rendering happens on **every request** — needed for per-user or per-request data
- Reading `cookies()`, `headers()`, or `searchParams` opts a route into dynamic rendering automatically
- `export const dynamic = 'force-static' | 'force-dynamic' | 'error' | 'auto'` overrides the automatic detection
- ISR (`revalidate: N`) is a static strategy — it just regenerates the cached page in the background
