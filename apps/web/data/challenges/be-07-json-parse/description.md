# Safe JSON Parse

## What You're Building

Implement a `safeJsonParse` function that wraps `JSON.parse` with error handling, returning a typed result object instead of throwing.

## Requirements

- Returns `{ ok: true, value: T }` on success
- Returns `{ ok: false, error: string }` on failure
- Never throws — always returns a result object
- Works with any JSON-parseable value (objects, arrays, primitives)
- The error message should be the caught error's message string

## Example

```js
safeJsonParse('{"name":"Alice"}')
// → { ok: true, value: { name: 'Alice' } }

safeJsonParse('not json')
// → { ok: false, error: 'Unexpected token ...' }

safeJsonParse('[1, 2, 3]')
// → { ok: true, value: [1, 2, 3] }
```

## Why This Comes Up in Interviews

`JSON.parse` throws on invalid input, which makes it dangerous to call on untrusted data. A `safeJsonParse` wrapper is a real-world pattern used in virtually every production codebase that parses external data. Interviewers use this to test your error handling instincts.

## What You Need to Know

- `JSON.parse()` and when it throws
- `try/catch` with typed error handling
- Generic return types: `{ ok: true; value: T } | { ok: false; error: string }`
- TypeScript discriminated unions
