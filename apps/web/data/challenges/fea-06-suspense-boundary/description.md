# Suspense Boundary

## What You're Building

Implement `createSuspenseBoundary` — a function that mimics React Suspense by handling async component rendering with a fallback.

## Requirements

- `createSuspenseBoundary({ fallback })` returns `{ render(asyncRenderFn) }`
- `render(asyncRenderFn)` calls the async function and returns a Promise
- While the async function is running, `getStatus()` returns `'pending'`
- On success, `getStatus()` returns `'resolved'` and `getResult()` returns the value
- On error, `getStatus()` returns `'rejected'` and `getError()` returns the error
- The fallback is what you'd show during loading (returned immediately as `render` starts)

## Example

```js
const boundary = createSuspenseBoundary({ fallback: 'Loading...' });

const promise = boundary.render(async () => {
  await delay(100);
  return '<UserProfile />';
});

boundary.getStatus(); // 'pending'
boundary.getFallback(); // 'Loading...'

await promise;
boundary.getStatus(); // 'resolved'
boundary.getResult(); // '<UserProfile />'
```

## Why This Comes Up in Interviews

React Suspense is a paradigm shift in how async rendering works. Understanding the underlying promise-based mechanism helps you use it correctly and build custom async boundaries.

## What You Need to Know

- Promise states: pending, resolved, rejected
- How React throws promises to trigger Suspense
- Fallback rendering during async loading
