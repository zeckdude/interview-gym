# Dynamic Routes with generateStaticParams

## What You're Building

A dynamic route like `app/blog/[slug]/page.tsx` can be **pre-rendered at build time** for every known value, instead of rendering on-demand for every visitor. Implement `generateStaticParams()` and `getPost()`, the pair of functions that make this possible.

## Requirements

- `generateStaticParams()` returns an array of `{ slug: string }` — one entry per post in the provided `posts` array, in the same order
- `getPost(slug)` returns the matching post object, or `undefined` if no post has that slug
- Both functions must read from the shared `posts` array (don't hardcode the values twice)

> **Expected Output**
>
> `generateStaticParams()` → `[{ slug: 'getting-started' }, { slug: 'app-router-guide' }, { slug: 'server-components' }]`

## Example

```ts
generateStaticParams();
// → [{ slug: 'getting-started' }, { slug: 'app-router-guide' }, { slug: 'server-components' }]

getPost('app-router-guide');
// → { slug: 'app-router-guide', title: 'The App Router Guide' }

getPost('does-not-exist');
// → undefined
```

## Why This Comes Up in Interviews

`generateStaticParams` is how Next.js replaced `getStaticPaths` from the Pages Router, and it's the mechanism behind pre-rendered blogs, docs sites, and product pages. Interviewers check that you understand it returns the **params shape**, not the full data — the page component still fetches the data itself using those params.

## What You Need to Know

- `generateStaticParams()` runs at **build time** and tells Next.js which param combinations to pre-render
- It returns an array of objects shaped exactly like the route's dynamic segments (`{ slug: '...' }` for `[slug]`)
- Params not listed can still render on-demand unless `dynamicParams = false` is set
- The page component itself is still responsible for fetching the actual data for each param
