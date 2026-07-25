# Unique Array Values

## What You're Building

Implement a `unique` function that returns a new array with all duplicate values removed, preserving the first occurrence of each value.

## Requirements

- `unique(arr)` returns a new array with duplicates removed
- Preserves the original order (first occurrence wins)
- Works with primitives: numbers, strings, booleans, null
- Does not modify the original array
- Also implement `uniqueBy(arr, keyFn)` for object arrays

## Example

```js
unique([1, 2, 1, 3, 2, 4]);
// → [1, 2, 3, 4]

unique(['a', 'b', 'a', 'c']);
// → ['a', 'b', 'c']

uniqueBy([{ id: 1 }, { id: 2 }, { id: 1 }], x => x.id);
// → [{ id: 1 }, { id: 2 }]
```

## Why This Comes Up in Interviews

De-duplication is a fundamental data processing operation. It tests your knowledge of Set, filtering, and higher-order functions. The `uniqueBy` variant tests your ability to generalize a solution.

## What You Need to Know

- `Set` — stores unique values
- `Array.from(new Set(arr))` — the idiomatic one-liner
- `filter` + `indexOf` as an alternative approach
- Key functions for object uniqueness
