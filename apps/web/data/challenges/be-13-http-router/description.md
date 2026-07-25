# HTTP Router

## What You're Building

Implement a simple `createRouter` function that matches incoming request paths to registered handlers — like a minimal Express router.

## Requirements

- `router.get(path, handler)` — register a GET route
- `router.post(path, handler)` — register a POST route
- `router.match(method, path)` — find and return the matching handler, or `null`
- Support named params: `/users/:id` should match `/users/42` with `{ id: '42' }`
- Handler signature: `(params: Record<string, string>) => string`

## Example

```js
const router = createRouter();
router.get('/users/:id', ({ id }) => `User: ${id}`);
router.post('/login', () => 'Logged in');

router.match('GET', '/users/99');
// → returns handler, calling it → 'User: 99'

router.match('GET', '/not-found');
// → null
```

## Why This Comes Up in Interviews

Routing is the entry point of every server. Understanding how URL patterns are matched — especially with dynamic segments — shows you understand how frameworks like Express work under the hood.

## What You Need to Know

- Regex for URL pattern matching: `:param` → `([^/]+)`
- `RegExp.exec()` for extracting named groups
- Method + path combination for unique route keys
