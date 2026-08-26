# Clamp Number to Range

## What You're Building

Implement `clamp(value, min, max)` — constrain a number to an inclusive range.

## Requirements

- Export a function named `clamp`
- Return `min` if `value` is below the range
- Return `max` if `value` is above the range
- Return `value` unchanged if it falls within the range

## Example

```js
clamp(15, 0, 10)  // 10 — capped at max
clamp(-3, 0, 10)  // 0  — raised to min
clamp(7, 0, 10)   // 7  — unchanged
```

## Why This Comes Up in Interviews

Volume sliders, scroll positions, and API rate limits all need values kept within bounds. Interviewers use `clamp` as a warm-up to see if you know `Math.min`/`Math.max` and can handle boundary values in one line.

## What You Need to Know

- `Math.max(min, value)` raises values below the minimum
- `Math.min(max, …)` caps values above the maximum
- Order matters: `Math.min(max, Math.max(min, value))`

## Edge Cases to Mention

- What if `min > max`? (Swap them or throw — state your choice)
- Clamp is for bounding, not validation with error messages
