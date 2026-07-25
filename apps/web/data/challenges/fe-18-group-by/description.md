# Group By Key

## What You're Building

Implement a `groupBy` function that groups array elements by a key derived from each element.

## Requirements

- `groupBy(arr, keyFn)` returns an object where each key maps to an array of matching items
- `keyFn` receives each element and returns the group key (string)
- Elements appear in their original order within each group
- All elements appear in exactly one group
- Works with any array of objects or primitives

## Example

```js
const people = [
  { name: 'Alice', dept: 'Engineering' },
  { name: 'Bob', dept: 'Design' },
  { name: 'Carol', dept: 'Engineering' },
];

groupBy(people, p => p.dept);
// → {
//   Engineering: [{ name: 'Alice', ... }, { name: 'Carol', ... }],
//   Design: [{ name: 'Bob', ... }],
// }

groupBy([1, 2, 3, 4, 5], n => n % 2 === 0 ? 'even' : 'odd');
// → { odd: [1, 3, 5], even: [2, 4] }
```

## Why This Comes Up in Interviews

`groupBy` is a staple data transformation — think SQL `GROUP BY` but in JavaScript. It's used everywhere: categorizing items, building lookup tables, aggregating analytics data. It tests your ability to think in transformations.

## What You Need to Know

- `reduce` to build the grouped object
- Dynamic object keys
- Initializing arrays on first encounter
