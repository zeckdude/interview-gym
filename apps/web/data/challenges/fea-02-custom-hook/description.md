# Custom useFetch Hook

## What You're Building

Implement the core logic of a `useFetch`-style hook — an async data fetcher that manages loading, data, and error states.

## Requirements

Implement `createFetchState(fetchFn)` that returns `{ execute(), getState() }`:
- `getState()` returns `{ data, loading, error }`
- `execute(url, options?)` triggers the fetch and updates state
- While fetching: `{ data: null, loading: true, error: null }`
- On success: `{ data: result, loading: false, error: null }`
- On error: `{ data: null, loading: false, error: Error }`
- Accepts a `fetchFn` dependency (for mocking)

## Example

```js
const fetcher = createFetchState(fetch);

fetcher.execute('/api/users');
fetcher.getState(); // → { data: null, loading: true, error: null }

// After resolve:
fetcher.getState(); // → { data: [...users], loading: false, error: null }
```

## Why This Comes Up in Interviews

Every React app needs data fetching. The `useFetch` pattern is a gateway to understanding React Query, SWR, and custom hooks. It tests your understanding of async state management and the three states all async operations have: loading, success, error.

## What You Need to Know

- The three states of async: loading, success, error
- State updates after async resolution
- Error boundaries: always catch promise rejections
- The fetch → JSON → state pipeline
