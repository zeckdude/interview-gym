# Route Handlers with Auth

## What You're Building

`route.ts` files let you write real API endpoints inside the App Router — a `GET`, `POST`, etc. function that receives a Request and returns a Response. Implement a `GET` handler that protects data behind a bearer token.

## Requirements

- `GET(request)` receives a mock request: `{ headers: { authorization?: string } }`
- If the `authorization` header is **missing** or doesn't start with `"Bearer "` → return `{ status: 401, body: { error: 'Unauthorized' } }`
- If the token after `"Bearer "` doesn't equal the valid token → also return `{ status: 401, body: { error: 'Unauthorized' } }`
- If the token is valid → return `{ status: 200, body: { data: ['item1', 'item2'] } }`
- The valid token is `'secret-token-123'` (already defined for you as `VALID_TOKEN`)

> **Expected Output**
>
> A request with `authorization: 'Bearer secret-token-123'` → `{ status: 200, body: { data: ['item1', 'item2'] } }`. Anything else → `401`.

## Example

```ts
GET({ headers: {} });
// → { status: 401, body: { error: 'Unauthorized' } }

GET({ headers: { authorization: 'Bearer secret-token-123' } });
// → { status: 200, body: { data: ['item1', 'item2'] } }
```

## Why This Comes Up in Interviews

Route Handlers replaced the old `pages/api` directory, and auth-gated endpoints are the #1 real-world use case. Interviewers want to see that you check **both** "is there a token" and "is it the right one" — a shockingly common mistake is only checking the header exists.

## What You Need to Know

- Route Handlers export functions named after HTTP methods: `GET`, `POST`, `PUT`, `DELETE`, etc.
- They live in a `route.ts` file — never alongside a `page.tsx` in the same segment
- Real handlers receive a Web-standard `Request` and return a `Response` (or `NextResponse`)
- Always fail closed: reject the request unless you can positively confirm the credentials are valid
