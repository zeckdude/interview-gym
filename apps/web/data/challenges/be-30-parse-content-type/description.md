# Parse Content-Type Header

## What You're Building

Implement `parseContentType(header)` — parse a Content-Type header into `{ type, charset }`.

## Requirements

- Export `parseContentType(header)`
- Lowercase the MIME type
- Return `charset: null` when no charset parameter is present
- Strip quotes from charset values

## Example

```js
parseContentType(/* args */)
```

## Why This Comes Up in Interviews

Interviewers use small pure functions to test whether you reason about types, edge cases, and clean APIs.

## What You Need to Know

- Understand HTTP headers
- Understand parsing
- Understand MIME
