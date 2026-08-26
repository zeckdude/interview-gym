# Chunk Array

## What You're Building

Implement `chunk(arr, size)` — split an array into sub-arrays of at most `size` items.

## Requirements

- Export a function named `chunk`
- Each sub-array has at most `size` elements
- The last chunk may be smaller than `size`
- Preserve element order

## Example

```js
chunk([1, 2, 3, 4, 5], 2)
// => [[1, 2], [3, 4], [5]]
```

## Why This Comes Up in Interviews

Batch API calls, pagination, and rate-limited processing all require splitting arrays into fixed-size groups. This tests array iteration and non-mutating `slice`.

## What You Need to Know

- `arr.slice(start, end)` returns a new array without mutating the original
- Loop with `i += size` to jump by chunk boundaries
- `slice` handles the last partial chunk automatically

## Edge Cases to Mention

- `size <= 0` causes an infinite loop if not handled — return `[]` or throw
- Empty input returns `[]`
