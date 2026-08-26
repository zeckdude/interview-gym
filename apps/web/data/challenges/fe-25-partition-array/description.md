# Partition Array by Predicate

## What You're Building

Implement `partition(arr, predicate)` — return `[pass, fail]` tuples split by a predicate.

## Requirements

- Export a function named `partition`
- Return a two-element array: `[matchingItems, nonMatchingItems]`
- Call the predicate exactly once per element
- Preserve original order within each group

## Example

```js
partition([1, 2, 3, 4], (n) => n % 2 === 0)
// => [[2, 4], [1, 3]]
```

## Why This Comes Up in Interviews

Splitting users into active/inactive, or items into valid/invalid, in a single pass. Tests higher-order functions and efficient iteration.

## What You Need to Know

- A predicate returns `true` or `false` for each item
- Single `for...of` loop — don't call `filter` twice
- Can also implement with `reduce`

## Edge Cases to Mention

- Empty array returns `[[], []]`
- When you only need one side, use `filter` instead
