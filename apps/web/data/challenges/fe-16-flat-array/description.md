# Flatten Nested Array

## What You're Building

Implement a `flatten` function that recursively flattens a nested array to a specified depth.

## Requirements

- `flatten(arr, depth?)` returns a new flat array
- `depth` defaults to `Infinity` (completely flat)
- `flatten(arr, 1)` only flattens one level deep
- Does not modify the original array
- Works with any nesting depth

## Example

```js
flatten([1, [2, [3, [4]]]]);      // → [1, 2, 3, 4]
flatten([1, [2, [3, [4]]]], 1);   // → [1, 2, [3, [4]]]
flatten([1, [2, [3, [4]]]], 2);   // → [1, 2, 3, [4]]
flatten([1, 2, 3]);               // → [1, 2, 3]
```

## Why This Comes Up in Interviews

Array flattening tests recursion and depth-tracking. It's a common coding screen question and directly maps to real utility work (flattening tree structures, query results, nested configs).

## What You Need to Know

- `Array.isArray()` to detect nested arrays
- Recursion with a depth counter
- `concat` or spread for building the result
