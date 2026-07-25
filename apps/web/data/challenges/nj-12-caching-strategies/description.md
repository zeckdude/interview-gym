# Next.js Caching Deep Dive

## What You're Building

Next.js caches `fetch()` calls by default, with two knobs to change that: `cache: 'no-store'` (never cache) and `revalidate: N` (cache for N seconds, then refresh). Implement `createFetchCache()`, a simplified version of this caching layer.

## Requirements

- `createFetchCache(clock)` returns `{ fetch(key, fetcher, options) }` — `clock` is a function returning the current time in ms (defaults to `Date.now`, but tests will pass a fake one)
- `options.cache === 'no-store'` → always call `fetcher()` fresh, never read or write the cache, and return `{ value, hit: false }`
- Otherwise (the default, like `force-cache`):
  - If there's a cached value for `key` **and** it hasn't expired, return `{ value: cachedValue, hit: true }` **without** calling `fetcher()`
  - Otherwise call `fetcher()`, store the result with the current time, and return `{ value, hit: false }`
- `options.revalidate` is a number of **seconds**. A cached entry expires once `clock() - cachedAt >= revalidate * 1000`. With no `revalidate`, a cached entry never expires.

> **Expected Output**
>
> Two calls to `fetch('a', fetcher, {})` back-to-back → first is `{ hit: false }` (calls `fetcher`), second is `{ hit: true }` (does **not** call `fetcher` again).

## Example

```ts
const cache = createFetchCache();

cache.fetch('user', () => getUser(), {});         // { value: ..., hit: false }
cache.fetch('user', () => getUser(), {});         // { value: ..., hit: true }  (cached)
cache.fetch('user', () => getUser(), { cache: 'no-store' }); // { value: ..., hit: false } (always fresh)
```

## Why This Comes Up in Interviews

Next.js's caching model has changed across versions and confuses even experienced developers — knowing exactly when `fetch()` hits the cache vs. the network is essential for debugging stale data in production. Interviewers use this to check you can reason about cache keys, expiry, and explicit opt-outs.

## What You Need to Know

- By default, `fetch()` requests in Next.js are cached indefinitely (like `force-cache`)
- `{ next: { revalidate: 60 } }` caches for 60 seconds, then refetches on the next request after that window
- `{ cache: 'no-store' }` opts a specific fetch out of caching entirely, regardless of the route's rendering mode
- The cache key is based on the URL and options — different fetchers for the same "key" should still share one cache entry here
