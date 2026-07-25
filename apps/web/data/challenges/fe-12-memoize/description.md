# Memoize Function

## What You're Building

Implement a `memoize` function that caches the results of expensive function calls — returning the cached result when called again with the same arguments.

## Requirements

- `memoize(fn)` returns a memoized version of `fn`
- Results are cached based on all arguments
- Cache key is derived from the arguments (assume serializable args)
- The original function is called at most once per unique argument combination
- Works for any number of arguments

## Example

```js
let callCount = 0;
const expensive = memoize((n) => {
  callCount++;
  return n * n;
});

expensive(5); // → 25, callCount = 1
expensive(5); // → 25, callCount = 1 (cached)
expensive(6); // → 36, callCount = 2
expensive(5); // → 25, callCount = 2 (still cached)
```

## Why This Comes Up in Interviews

Memoization is a fundamental optimization technique and a gateway to understanding dynamic programming. It's used in React (`useMemo`, `React.memo`), Redux selectors (Reselect), and countless performance-critical algorithms.

## What You Need to Know

- `Map` or plain object for the cache
- `JSON.stringify` for creating cache keys from arguments
- When to memoize vs. not (pure functions only)
