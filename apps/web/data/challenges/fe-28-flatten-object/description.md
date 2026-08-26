# Flatten Nested Object

## What You're Building

Implement `flattenObject(obj)` — flatten nested plain objects into dot-separated key paths.

## Requirements

- Export a function named `flattenObject`
- Nested plain objects become dot-path keys: `{ a: { b: 1 } }` → `{ "a.b": 1 }`
- Leaf values (primitives, arrays, null) are assigned directly
- Only recurse into plain objects (not arrays)

## Example

```js
flattenObject({ a: { b: 1 }, c: 2 })
// => { "a.b": 1, "c": 2 }
```

## Why This Comes Up in Interviews

Config overrides, form libraries, and env-var systems often need flat key spaces. Tests recursion and `Object.entries`.

## What You Need to Know

- Plain object check: `value != null && typeof value === 'object' && !Array.isArray(value)`
- Build path prefix as you recurse: `prefix ? `${prefix}.${key}` : key`
- `typeof null === 'object'` — guard against null

## Edge Cases to Mention

- Arrays treated as leaf values unless you add index-based paths
- Empty nested objects produce no output keys
