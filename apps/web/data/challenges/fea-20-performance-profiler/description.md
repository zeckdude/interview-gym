# Performance Profiler

## What You're Building

Implement `createProfiler` — a lightweight performance measurement utility, equivalent to what React's `<Profiler>` component and the browser's Performance API provide.

## Requirements

- `createProfiler(name)` returns `{ start(label), end(label), getMeasurements(), getSummary() }`
- `start(label)` records the start time
- `end(label)` records the end time, computes duration
- `getMeasurements()` returns all completed measurements: `{ label, duration, startTime, endTime }[]`
- `getSummary()` returns per-label stats: `{ label, count, totalMs, avgMs, minMs, maxMs }[]`
- Accepts a `clock` option for testability

## Example

```js
const profiler = createProfiler('MyComponent');
profiler.start('render');
// ...work...
profiler.end('render');

profiler.getSummary();
// [{ label: 'render', count: 1, totalMs: 12, avgMs: 12, minMs: 12, maxMs: 12 }]
```

## Why This Comes Up in Interviews

Performance profiling is fundamental to optimization work. React's Profiler API, the browser Performance API (`performance.mark`, `performance.measure`), and tools like Lighthouse all use this pattern. Senior engineers are expected to measure before optimizing.

## What You Need to Know

- `performance.now()` for high-resolution timing
- React `<Profiler onRender={...}>` — records render timing
- Amdahl's Law: optimize the slowest parts first
- How to identify render bottlenecks with the React DevTools profiler
