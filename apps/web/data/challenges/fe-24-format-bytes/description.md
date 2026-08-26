# Format Byte Size

## What You're Building

Implement `formatBytes(bytes)` — human-readable file sizes using 1024-based units.

## Requirements

- Export a function named `formatBytes`
- Return `"0 B"` for zero bytes
- Use binary units: B, KB, MB, GB (powers of 1024)
- Round to one decimal place

## Example

```js
formatBytes(0)     // "0 B"
formatBytes(1536)  // "1.5 KB"
```

## Why This Comes Up in Interviews

File managers and download progress bars need human-readable sizes. This tests number manipulation, logarithms, and string formatting in one function.

## What You Need to Know

- Unit index: `Math.floor(Math.log(bytes) / Math.log(1024))`
- Value: `bytes / Math.pow(1024, unitIndex)`
- Guard `bytes === 0` before taking the log

## Edge Cases to Mention

- `Math.log(0)` is `-Infinity` — handle zero explicitly
- Clarify binary (1024) vs decimal (1000) conventions
