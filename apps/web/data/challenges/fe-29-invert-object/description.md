# Invert Object Keys and Values

## What You're Building

Implement `invertObject(obj)` — swap keys and values (values must be stringifiable).

## Requirements

- Export a function named `invertObject`
- Each value becomes a key (coerced with `String(value)`)
- Each original key becomes the new value
- Values must be string or number

## Example

```js
invertObject({ a: '1', b: '2' })
// => { "1": "a", "2": "b" }
```

## Why This Comes Up in Interviews

Status code maps, enum lookups, and bidirectional dictionaries all need key-value inversion. Tests `Object.entries` and key coercion rules.

## What You Need to Know

- Iterate with `Object.entries(obj)`
- Coerce values: `result[String(value)] = key`
- Object keys are always strings

## Edge Cases to Mention

- Duplicate values overwrite earlier keys — mention collision handling
- Non-stringifiable values (objects) produce `"[object Object]"` keys
