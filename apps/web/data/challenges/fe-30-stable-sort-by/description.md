# Stable Sort By Key

## What You're Building

Implement `stableSortBy(arr, keyFn)` — sort by a key function without reordering equal elements.

## Requirements

- Export a function named `stableSortBy`
- Sort ascending by `keyFn(item)`
- When keys are equal, preserve original input order
- Do not mutate the original array

## Example

```js
const items = [
  { name: 'a', score: 1 },
  { name: 'b', score: 1 },
  { name: 'c', score: 0 },
];
stableSortBy(items, (x) => x.score)
// => [{ name: 'c', score: 0 }, { name: 'a', score: 1 }, { name: 'b', score: 1 }]
```

## Why This Comes Up in Interviews

Leaderboards and tables with tied values need stable ordering. Tests the decorate-sort-undecorate pattern and comparator design.

## What You Need to Know

- Map to `{ item, index }` before sorting
- Break ties with `a.index - b.index`
- Map back to items after sorting

## Edge Cases to Mention

- Sorting without a tiebreaker may reorder equal elements
- JS `Array.sort` is stable since ES2019, but implement explicitly to show understanding
