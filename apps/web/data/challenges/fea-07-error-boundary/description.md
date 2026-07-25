# Error Boundary

## What You're Building

Implement `createErrorBoundary` — the logic behind React's Error Boundary class component. It catches errors in child rendering and shows a fallback UI.

## Requirements

- `createErrorBoundary({ fallback })` returns `{ render(renderFn), hasError(), getError() }`
- `render(renderFn)` calls `renderFn()` inside a try/catch
- If `renderFn()` throws, captures the error and returns the fallback
- If it succeeds, returns the rendered result
- `hasError()` returns boolean indicating if an error was caught
- `getError()` returns the caught error (or null)

## Example

```js
const boundary = createErrorBoundary({ fallback: 'Something went wrong' });

boundary.render(() => 'Normal content'); // → 'Normal content'
boundary.hasError(); // false

const boundary2 = createErrorBoundary({ fallback: 'Error!' });
boundary2.render(() => { throw new Error('oops'); }); // → 'Error!'
boundary2.hasError(); // true
boundary2.getError().message; // 'oops'
```

## Why This Comes Up in Interviews

Error boundaries are required for resilient React UIs. Implementing one proves you understand class component lifecycle methods (`componentDidCatch`), the difference between recoverable and unrecoverable errors, and graceful degradation.

## What You Need to Know

- try/catch for synchronous error catching
- Why React error boundaries use class components (not hooks — hooks can't catch render errors)
- Fallback UI pattern
- Error recovery strategies
