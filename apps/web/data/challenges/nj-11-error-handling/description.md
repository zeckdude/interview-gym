# Error and Loading UI

## What You're Building

`loading.tsx` and `error.tsx` give every route automatic loading and error states — but the underlying pattern is just async state tracking with a **reset**. Implement `createAsyncState()`, the state machine that powers both.

## Requirements

- `createAsyncState()` returns an object with `run(fn)`, `getStatus()`, `getData()`, `getError()`, and `reset()`
- `getStatus()` starts as `'idle'`
- `run(fn)` immediately sets status to `'loading'`, then calls `fn()`
- On success: status becomes `'success'` and `getData()` returns the resolved value
- On failure: status becomes `'error'` and `getError()` returns the thrown error (don't let it crash the caller — catch it internally)
- `reset()` — mirrors the `reset()` function Next.js passes to your `error.tsx` — clears the error and data and returns status to `'idle'`, ready to try again

> **Expected Output**
>
> After calling `run()` with a function that rejects, `getStatus()` → `'error'` and `getError()` → the error object. After `reset()`, `getStatus()` → `'idle'`.

## Example

```ts
const state = createAsyncState();
state.getStatus(); // 'idle'

const promise = state.run(() => fetchData());
state.getStatus(); // 'loading'

await promise;
state.getStatus(); // 'success' or 'error'

state.reset();
state.getStatus(); // 'idle'
```

## Why This Comes Up in Interviews

`error.tsx` is one of the few App Router files that receives special props (`error`, `reset`) automatically — interviewers ask this to check you understand `reset()` doesn't undo the error, it just gives the boundary a chance to re-render and try again.

## What You Need to Know

- `loading.tsx` wraps the route in a `<Suspense>` boundary automatically — no manual `<Suspense>` needed
- `error.tsx` must be a Client Component and receives `{ error, reset }` as props
- `reset()` attempts to re-render the segment — it does **not** guarantee success if the underlying problem persists
- Errors thrown in a Server Component bubble up to the nearest `error.tsx` boundary
