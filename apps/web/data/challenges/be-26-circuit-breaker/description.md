# Circuit Breaker Factory

## What You're Building

Implement `createCircuitBreaker(threshold)` — a factory that stops calling a failing dependency after repeated errors.

## Requirements

- Export `createCircuitBreaker(threshold)`
- Return an object with `execute(fn)`, `isOpen()`, and `reset()`
- `execute` rejects immediately when the circuit is open

## Example

```js
createCircuitBreaker(/* args */)
```

## Why This Comes Up in Interviews

Circuit breakers protect downstream services during outages — a classic backend systems design question.

## What You Need to Know

- Understand resilience
- Understand circuit breaker
- Understand factories
