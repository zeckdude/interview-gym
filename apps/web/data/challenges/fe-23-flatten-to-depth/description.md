# Flatten Array to Depth

## What You're Building

Implement `flattenToDepth(arr, depth)` — flatten nested arrays up to a given depth.

## Requirements

- Export a function named `flattenToDepth`
- Unwrap nested arrays only while `depth > 0`
- `depth = 0` returns the array unchanged
- Non-array elements are pushed as-is

## Example

```js
flattenToDepth([[1, 2], [3]], 1)
// => [1, 2, 3]

flattenToDepth([[1, [2]]], 1)
// => [1, [2]]  — inner array stays nested
```

## Why This Comes Up in Interviews

Form builders and data pipelines return nested structures that downstream code expects flat. This tests recursion and `Array.isArray`.

## What You Need to Know

- Use `Array.isArray(item)` — not `typeof item === 'object'`
- Recurse with `depth - 1` when the item is an array and depth remains
- Built-in alternative: `arr.flat(depth)` — implement manually for the interview

## Edge Cases to Mention

- `depth = 0` means no flattening at all
- Arrays are objects in JS — always use `Array.isArray`
