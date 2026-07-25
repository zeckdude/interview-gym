# Sort Array of Objects

## What You're Building

Implement a `sortBy` function that sorts an array of objects by a specified key, with support for ascending and descending order.

## Requirements

- `sortBy(arr, key, direction?)` returns a NEW sorted array
- `direction` is `'asc'` (default) or `'desc'`
- Handles string and number values
- Does not mutate the original array
- Stable sort: items with equal keys maintain original relative order

## Example

```js
const people = [
  { name: 'Carol', age: 25 },
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
];

sortBy(people, 'name');
// → [Alice(30), Bob(25), Carol(25)]

sortBy(people, 'age', 'desc');
// → [Alice(30), Carol(25), Bob(25)]

sortBy(people, 'age', 'asc');
// → [Carol(25), Bob(25), Alice(30)]
```

## Why This Comes Up in Interviews

Sorting is fundamental to data display. Every table, list, and leaderboard needs it. The challenge tests your understanding of comparison functions, stability, and immutability.

## What You Need to Know

- `Array.prototype.sort` with a comparator
- Not mutating: `[...arr].sort(...)` or `arr.slice().sort(...)`
- Comparison: `a < b ? -1 : a > b ? 1 : 0`
- Reversing: negate the comparator for descending
