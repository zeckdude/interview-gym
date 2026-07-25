# Database Singleton

## What You're Building

Implement a `createDatabaseSingleton` function that ensures only one database connection instance is ever created — the classic Singleton pattern applied to database connections.

## Requirements

- `createDatabaseSingleton(connectFn)` returns a `{ getInstance() }` object
- `connectFn` is an async function that creates and returns the connection
- `getInstance()` returns a Promise resolving to the connection
- Multiple calls to `getInstance()` must return the **same** instance
- `connectFn` must be called **exactly once** regardless of how many times `getInstance()` is called
- Concurrent calls to `getInstance()` must not cause multiple connections

## Example

```js
let callCount = 0;
const singleton = createDatabaseSingleton(async () => {
  callCount++;
  return { query: () => 'results' };
});

const [a, b, c] = await Promise.all([
  singleton.getInstance(),
  singleton.getInstance(),
  singleton.getInstance(),
]);

// a === b === c (same reference)
// callCount === 1 (connected only once)
```

## Why This Comes Up in Interviews

Database connection pooling and singleton patterns are fundamental backend architecture concepts. This tests your understanding of lazy initialization, reference equality, and handling concurrent async requests correctly.

## What You Need to Know

- Lazy initialization: only connect when first needed
- Storing the result Promise to prevent duplicate connections
- Reference equality vs. value equality
