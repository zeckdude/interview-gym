# Virtual DOM Diff

## What You're Building

Implement a `diff` function that compares two virtual DOM trees and returns a list of patches describing what changed — the core algorithm behind React and Vue.

## Requirements

- `diff(oldTree, newTree)` returns an array of patches
- Each patch: `{ type: 'UPDATE' | 'REPLACE' | 'ADD' | 'REMOVE', path: string, value?: unknown }`
- Path uses dot notation: `'props.className'`, `'children.0.text'`
- Detects: text changes, prop changes, type changes (→ REPLACE), node additions/removals
- For this challenge, assume flat trees (no deep recursion required for children)

## Example

```js
const old = { type: 'div', props: { className: 'box' }, children: [] };
const next = { type: 'div', props: { className: 'box active' }, children: [] };

diff(old, next);
// → [{ type: 'UPDATE', path: 'props.className', value: 'box active' }]
```

## Why This Comes Up in Interviews

Virtual DOM diffing is one of the most famous algorithms in frontend engineering. Even if you never implement React from scratch, understanding diffing makes you a better React developer — you'll understand why keys matter, what causes unnecessary re-renders, and how reconciliation works.

## What You Need to Know

- Object comparison with `JSON.stringify` or key-by-key
- Path tracking for nested changes
- The difference between UPDATE (same type) and REPLACE (different type)
- Why React requires stable keys for list items
