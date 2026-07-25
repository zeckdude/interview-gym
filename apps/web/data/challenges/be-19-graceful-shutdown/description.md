# Graceful Shutdown

## What You're Building

Implement a `createShutdownManager` that collects cleanup handlers and runs them all in order when shutdown is triggered — like the graceful shutdown logic you'd put before `process.exit()`.

## Requirements

- `manager.onShutdown(handler)` — registers an async cleanup handler
- `manager.shutdown(reason?)` — runs all handlers in order, then resolves
- Handlers run sequentially (await each before starting the next)
- Each handler receives the shutdown `reason` string
- `manager.shutdown()` can only trigger once — subsequent calls are no-ops
- Returns a Promise that resolves when all handlers complete

## Example

```js
const manager = createShutdownManager();

manager.onShutdown(async (reason) => {
  await closeDatabase();
  console.log('DB closed, reason:', reason);
});

manager.onShutdown(async () => {
  await flushLogs();
});

await manager.shutdown('SIGTERM');
// → handlers run in registration order
```

## Why This Comes Up in Interviews

Graceful shutdown is a critical production pattern. Without it, in-flight requests get dropped and data can be corrupted. Senior engineers are expected to know how to implement it correctly.

## What You Need to Know

- Sequential async execution with `for...of` + `await`
- Idempotency: ensuring shutdown only runs once
- Promise-based cleanup coordination
