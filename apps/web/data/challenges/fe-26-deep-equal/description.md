# Deep Equal Comparison

## What You're Building

Implement `deepEqual(a, b)` — recursive equality for plain objects and primitives.

## Requirements

- Export a function named `deepEqual`
- Return `true` for structurally equal plain objects and primitives
- Return `false` for different structures or types
- Handle nested objects recursively

## Example

```js
deepEqual({ a: { b: 1 } }, { a: { b: 1 } })  // true
deepEqual({ a: 1 }, { a: 2 })                 // false
```

## Why This Comes Up in Interviews

React dependency arrays, test assertions, and state diffing all need to know if nested structures match. `===` fails for objects — interviewers want to see recursion and type checking.

## What You Need to Know

- Base case: `a === b` returns `true`
- Guard: null and non-objects return `false` when types differ
- Compare key counts, then recurse on each key's value

## Edge Cases to Mention

- `JSON.stringify` fails for key order, undefined, and circular refs
- Arrays are objects — consider `Array.isArray` for robust implementations
