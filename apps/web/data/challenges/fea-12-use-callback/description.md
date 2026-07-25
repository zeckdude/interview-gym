# useCallback & useMemo

## What You're Building

Implement `memoizeWithDeps` — the pure JS equivalent of React's `useCallback` and `useMemo`. It re-computes a value only when its dependencies change.

## Requirements

- `memoizeWithDeps(factory, deps)` → `value`
- The factory function is called once on first invocation
- Returns the same cached value as long as `deps` array is the same (shallow equality)
- When `deps` change, the factory is called again
- Implement `createMemoHook()` that returns a `memo(factory, deps)` function with its own cache

## Example

```js
const { memo } = createMemoHook();

let callCount = 0;
const a = memo(() => { callCount++; return 42; }, ['x']);
const b = memo(() => { callCount++; return 42; }, ['x']); // same deps → cached
const c = memo(() => { callCount++; return 99; }, ['y']); // different deps → recomputed

callCount; // 2 (first call + deps changed)
```

## Why This Comes Up in Interviews

`useMemo` and `useCallback` are the primary React performance tools. Implementing them from scratch proves you understand shallow comparison, referential stability, and when React re-renders.

## What You Need to Know

- Shallow equality: comparing arrays element by element
- When to memoize: expensive computations, stable function references
- The difference between useMemo (values) and useCallback (functions)
- Why deps array comparison must be shallow, not deep
