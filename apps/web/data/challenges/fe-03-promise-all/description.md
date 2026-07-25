# Promise.all Polyfill

## What You're Building

Implement `promiseAll` — a polyfill for `Promise.all()` that runs promises concurrently and returns all results in order.

## Requirements

- `promiseAll(promises)` accepts an array of Promises (or values)
- Returns a single Promise that resolves with an array of all results **in the original order**
- If any Promise rejects, the returned Promise rejects immediately with that error
- Non-promise values are treated as resolved immediately
- An empty array resolves with `[]`

## Example

```js
const results = await promiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3),
]);
// → [1, 2, 3]

await promiseAll([
  Promise.resolve('ok'),
  Promise.reject(new Error('fail')),
]);
// → throws Error('fail')
```

## Why This Comes Up in Interviews

`Promise.all` is one of the most important async utilities in JavaScript. Implementing it from scratch proves you understand Promises at a deep level — not just how to use them, but how they work internally.

## What You Need to Know

- The Promise constructor: `new Promise((resolve, reject) => ...)`
- `Promise.resolve(value)` to wrap non-promise values
- Tracking completion count to know when all resolved
- Short-circuit rejection: first rejection wins
