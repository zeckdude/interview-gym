# Deep Clone Object

## What You're Building

Implement a `deepClone` function that creates a complete, independent copy of a nested object — no shared references.

## Requirements

- Handles nested objects and arrays recursively
- Handles primitive values (string, number, boolean, null, undefined)
- The clone must be completely independent — modifying the clone must not affect the original
- Handles arrays correctly (returns array, not object)
- You do NOT need to handle: Date, Map, Set, functions, circular references

## Example

```js
const original = { a: 1, b: { c: [1, 2, 3], d: { e: 'deep' } } };
const clone = deepClone(original);

clone.b.c.push(4);
clone.b.d.e = 'changed';

original.b.c; // [1, 2, 3] — unchanged
original.b.d.e; // 'deep' — unchanged
```

## Why This Comes Up in Interviews

Deep cloning is a classic interview question that tests recursion, type checking, and understanding of reference vs. value semantics in JavaScript. It's also practically important for immutable state management (Redux, React state).

## What You Need to Know

- `Array.isArray()` to distinguish arrays from objects
- Recursive traversal of nested structures
- Spread operator vs. deep copy
- Why `JSON.parse(JSON.stringify(obj))` is insufficient (loses functions, undefined, Date)
