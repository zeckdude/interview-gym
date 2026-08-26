# Run Tasks With Concurrency Limit

## What You're Building

Implement `runWithConcurrency(tasks, limit)` — run async tasks with at most `limit` in flight.

## Requirements

- Export an async function named `runWithConcurrency`
- Each task is a function returning a Promise
- At most `limit` tasks run concurrently
- Return results in the same order as the input tasks

## Example

```js
const tasks = [
  () => Promise.resolve(1),
  () => Promise.resolve(2),
  () => Promise.resolve(3),
];
await runWithConcurrency(tasks, 2)
// => [1, 2, 3]
```

## Why This Comes Up in Interviews

Uploading files, batch API calls, and scraping all need concurrency caps. `Promise.all` runs everything at once — this pattern keeps a fixed pool of workers busy.

## What You Need to Know

- Shared `nextIndex` counter — workers pull tasks dynamically
- `Math.min(limit, tasks.length)` worker count
- `Promise.all(workers)` waits for completion

## Edge Cases to Mention

- Don't assign tasks to workers upfront — workers must pull from a queue
- `Promise.all(tasks.map(t => t()))` has no concurrency limit
