# Safe Parse Integer

## What You're Building

Implement `safeParseInt(value, fallback)` — parse base-10 integers without NaN leaks.

## Requirements

- Export a function named `safeParseInt`

## Example

```js
safeParseInt('12', 0) // 12
safeParseInt('x', 0) // 0
```

## Why This Comes Up in Interviews

User input and env vars are strings — safe parsing prevents NaN from propagating through your app.

## What You Need to Know

- Understand parsing
- Understand numbers
- Understand NaN
