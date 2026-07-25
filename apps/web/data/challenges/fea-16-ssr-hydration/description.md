# SSR Hydration

## What You're Building

Implement `createHydrationManager` — the pattern behind React's hydration. It serializes server-rendered data into the HTML, then deserializes it on the client to avoid a second fetch.

## Requirements

- `serialize(data)` → JSON string safe to embed in `<script>` tags (escape `</script>`)
- `deserialize(raw)` → recovers the original data
- `createHydrationManager()` returns `{ inject(key, data), extract(key), getAll() }`
- `inject(key, data)` stores serialized data by key
- `extract(key)` retrieves and deserializes data by key
- `getAll()` returns all stored entries as `{ [key]: data }`

## Example

```js
const mgr = createHydrationManager();
mgr.inject('user', { id: 1, name: 'Alice' });
mgr.inject('posts', [{ id: 1, title: 'Hello' }]);

const raw = mgr.extract('user');
// { id: 1, name: 'Alice' }

mgr.getAll();
// { user: { id: 1, name: 'Alice' }, posts: [...] }
```

## Why This Comes Up in Interviews

SSR hydration is fundamental to Next.js, Remix, and SvelteKit. Understanding how data passes from server to client (avoiding waterfalls) is essential for senior frontend roles that own full-stack rendering.

## What You Need to Know

- How Next.js `getServerSideProps` passes data via `__NEXT_DATA__`
- Why `</script>` must be escaped in embedded JSON
- The difference between hydration and re-rendering
- React 18's `hydrateRoot` vs `createRoot`
