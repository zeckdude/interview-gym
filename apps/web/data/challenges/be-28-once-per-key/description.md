# Idempotent oncePerKey

## What You're Building

Implement `oncePerKey()` — return a function that runs a callback at most once per string key.

## Requirements

- Export `oncePerKey()` with no arguments
- Returned function signature: `(key, fn) => boolean`
- Return `true` when the callback runs, `false` when the key was already seen

## Example

```js
oncePerKey(/* args */)
```

## Why This Comes Up in Interviews

Idempotency keys prevent duplicate side effects — essential for webhooks, payments, and message queues.

## What You Need to Know

- Understand idempotency
- Understand deduplication
- Understand closures
