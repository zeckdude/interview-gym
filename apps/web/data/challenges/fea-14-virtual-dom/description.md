# Virtual DOM Diff

## What You're Building

Implement `diff(oldTree, newTree)` — the core algorithm that powers React's reconciler. It computes the minimal set of changes needed to update a UI tree.

## Requirements

- `diff(oldNode, newNode)` returns an array of patch operations
- Patch types: `'REPLACE'`, `'UPDATE_PROPS'`, `'REMOVE'`, `'ADD'`, `'TEXT_CHANGE'`
- If type changes → `REPLACE`
- If text content changes → `TEXT_CHANGE`
- If props change → `UPDATE_PROPS` with `{ key, oldValue, newValue }`
- Each node: `{ type: string, props: object, children: Node[], text?: string }`

## Example

```js
const old = { type: 'div', props: { class: 'a' }, children: [] };
const next = { type: 'div', props: { class: 'b' }, children: [] };

diff(old, next);
// [{ type: 'UPDATE_PROPS', key: 'class', oldValue: 'a', newValue: 'b' }]
```

## Why This Comes Up in Interviews

Virtual DOM diffing is one of the most famous algorithms in frontend engineering. It shows up in system design interviews for components like data tables, lists, and any high-frequency UI updates. Implementing a basic version proves you deeply understand how React works under the hood.

## What You Need to Know

- React reconciliation and the fiber architecture
- Why keys matter in lists (O(n) vs O(n³) diffing)
- The difference between shallow and deep DOM diffing
- When React bails out of reconciliation (same reference)
