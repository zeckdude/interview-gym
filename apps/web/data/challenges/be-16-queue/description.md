# Job Queue

## What You're Building

Implement a `createJobQueue` function that creates a concurrency-limited async job queue — similar to `p-limit` or Bull queue's core concept.

## Requirements

- `createJobQueue(concurrency)` returns a queue with `add(job)` method
- `add(job)` enqueues the async job function and returns a Promise with its result
- At most `concurrency` jobs run simultaneously
- Jobs run in FIFO order (first in, first out)
- When a running job finishes, the next pending job starts automatically

## Example

```js
const queue = createJobQueue(2); // max 2 concurrent

const results = await Promise.all([
  queue.add(async () => { await sleep(50); return 'a'; }),
  queue.add(async () => { await sleep(10); return 'b'; }),
  queue.add(async () => 'c'), // waits until one of first two finishes
]);
// results → ['a', 'b', 'c']
```

## Why This Comes Up in Interviews

Job queues are core infrastructure for any system doing background work. Implementing one from scratch tests your understanding of Promise chaining, concurrency control, and queue data structures.

## What You Need to Know

- Promise chaining for sequencing
- Tracking active job count
- A pending queue for jobs waiting to start
- Resolve/reject pattern for queued promises
