# Middleware for Auth & Redirects

## What You're Building

Middleware runs **before** a request reaches any route — the perfect place to gate protected pages and bounce logged-in users away from the login screen. Implement `middleware()`, a simplified model of a real `middleware.ts`.

## Requirements

- `middleware(request)` receives `{ pathname: string, cookies: Record<string, string> }`
- Protected paths are `/dashboard` and `/settings` (and anything nested under them, like `/settings/profile`)
- If the request targets a protected path **without** a `session` cookie → `{ type: 'redirect', destination: '/login' }`
- If the request targets `/login` **with** a `session` cookie already set → `{ type: 'redirect', destination: '/dashboard' }` (no reason to show the login page twice)
- Everything else → `{ type: 'next' }` (let the request through)

> **Expected Output**
>
> `middleware({ pathname: '/dashboard', cookies: {} })` → `{ type: 'redirect', destination: '/login' }`

## Example

```ts
middleware({ pathname: '/dashboard', cookies: {} });
// → { type: 'redirect', destination: '/login' }

middleware({ pathname: '/dashboard', cookies: { session: 'abc123' } });
// → { type: 'next' }

middleware({ pathname: '/login', cookies: { session: 'abc123' } });
// → { type: 'redirect', destination: '/dashboard' }
```

## Why This Comes Up in Interviews

Auth gating is the textbook use case for Middleware, but candidates often forget the **reverse redirect** (kicking logged-in users off `/login`) and forget that protected routes should match nested paths, not just an exact string. Both trip people up in real interviews.

## What You Need to Know

- Middleware runs on the **Edge Runtime**, before rendering starts — it can only read/write cookies and headers, not touch a database directly
- It's defined once, in a top-level `middleware.ts`, and applies to matching routes via a `matcher` config
- Use `NextResponse.redirect()` to redirect and `NextResponse.next()` to continue
- Always check for **nested** protected paths (`/settings/profile` should be protected too, not just `/settings` exactly)
