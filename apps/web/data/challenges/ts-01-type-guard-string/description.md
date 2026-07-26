# Type Guard — isString

## What You're Building

Implement a type guard `isString` that narrows unknown values to string.

## Requirements

- Export `isString(value)` returning a boolean
- Return true only when value is a string

## Example

```js
isString('hi') // true
isString(1) // false
```

## Why This Comes Up in Interviews

Type guards are foundational in TypeScript interviews — they show you understand runtime checks vs compile-time types.

## What You Need to Know

- Understand type guards
- Understand typeof
- Understand narrowing
