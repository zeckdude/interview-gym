# Exponential Backoff With Jitter

## What You're Building

Implement `backoffWithJitter(attempt, initialMs, factor, jitterMs)` — compute retry delay with random jitter.

## Requirements

- Export `backoffWithJitter(attempt, initialMs, factor, jitterMs)`
- Base delay is `initialMs * factor ** attempt`
- Add random jitter from `0` to `jitterMs` (inclusive)
- Return a rounded integer millisecond value

## Example

```js
backoffWithJitter(/* args */)
```

## Why This Comes Up in Interviews

Jitter prevents thundering herds when many clients retry simultaneously.

## What You Need to Know

- Understand retry
- Understand exponential backoff
- Understand jitter
