# Higher-Order Component

## What You're Building

Implement `withLogger` — a Higher-Order Component (HOC) that wraps any render function and logs when it renders and with what props.

## Requirements

- `withLogger(renderFn, componentName?)` returns a wrapped render function
- The wrapped function logs `"[componentName] render { ...props }"` before rendering
- Logs to a `logs[]` array (captured in closure) instead of console for testability
- Returns `{ render(props), getLogs() }`
- Also implement `withErrorBoundary(renderFn)` that catches errors in renderFn

## Example

```js
const LoggedButton = withLogger((props) => \`<button>\${props.label}</button>\`, 'Button');

LoggedButton.render({ label: 'Click' });
LoggedButton.getLogs();
// → ['[Button] render { label: "Click" }']
```

## Why This Comes Up in Interviews

HOCs were the predecessor to hooks for cross-cutting concerns (logging, auth, analytics). Understanding HOCs shows React historical knowledge and the ability to compose behavior declaratively.

## What You Need to Know

- HOC: a function that takes a component and returns an enhanced component
- Cross-cutting concerns: logging, authentication, error handling
- The difference between HOCs and hooks
- Why HOCs can cause "wrapper hell"
