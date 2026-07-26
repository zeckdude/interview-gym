# Token Bucket Rate Limiter

## What You're Building

Implement `createTokenBucket(capacity, refillRate, refillMs)` — allow bursts up to capacity with steady refill.

## Requirements

- Export `createTokenBucket(capacity, refillRate, refillMs)`
- Return `{ tryConsume(count?), getTokens() }`
- Refill adds `refillRate` tokens every `refillMs` milliseconds, capped at capacity

## Example

```js
createTokenBucket(/* args */)
```

## Why This Comes Up in Interviews

Interviewers use small pure functions to test whether you reason about types, edge cases, and clean APIs.

## What You Need to Know

- Understand rate limiting
- Understand token bucket
- Understand factories
