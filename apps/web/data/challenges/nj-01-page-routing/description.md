# App Router: Pages and Layouts

## What You're Building

Next.js's App Router turns your **file system** into your **routes**. Implement `matchRoute()` — a mini version of the router that Next.js runs internally to decide which `page.tsx` handles an incoming URL.

## Requirements

- `matchRoute(routes, pathname)` takes an array of file paths (like Next.js's `app/` directory) and a URL pathname
- Static segments must match exactly: `app/about/page.tsx` → `/about`
- Dynamic segments `[slug]` match any single path segment and capture it: `app/blog/[slug]/page.tsx` → `/blog/hi` captures `{ slug: 'hi' }`
- Catch-all segments `[...slug]` match one or more remaining segments, joined with `/`: `app/shop/[...slug]/page.tsx` → `/shop/a/b` captures `{ slug: 'a/b' }`
- **Route groups** `(name)` are invisible to the URL — they organize files without adding a URL segment
- No match returns `{ file: null, params: {} }`

> **Expected Output**
>
> `matchRoute(routes, '/blog/hello-world')` → `{ file: 'app/blog/[slug]/page.tsx', params: { slug: 'hello-world' } }`

## Example

```ts
const routes = [
  'app/page.tsx',
  'app/about/page.tsx',
  'app/blog/[slug]/page.tsx',
  'app/(marketing)/pricing/page.tsx',
  'app/shop/[...slug]/page.tsx',
];

matchRoute(routes, '/');          // { file: 'app/page.tsx', params: {} }
matchRoute(routes, '/pricing');   // { file: 'app/(marketing)/pricing/page.tsx', params: {} }
matchRoute(routes, '/shop/a/b/c'); // { file: 'app/shop/[...slug]/page.tsx', params: { slug: 'a/b/c' } }
```

## Why This Comes Up in Interviews

Interviewers use this to check whether you actually understand the App Router's file conventions instead of just having copy-pasted a folder structure before. Route groups, dynamic segments, and catch-alls are the building blocks of nearly every real Next.js app.

## What You Need to Know

- `page.tsx` defines a route's UI; `layout.tsx` wraps nested routes and persists across navigations
- `[slug]` = one dynamic segment, `[...slug]` = catch-all (1+ segments), `[[...slug]]` = optional catch-all
- `(groupName)` folders organize routes without affecting the URL
- The router matches the **most specific** path — static segments win over dynamic ones at the same level
