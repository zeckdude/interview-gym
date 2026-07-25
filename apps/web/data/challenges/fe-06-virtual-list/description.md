# Virtual List Renderer

## What You're Building

Implement `getVisibleItems` — the core calculation behind virtual list rendering. Given a list of items and a scroll position, return only the items that should be visible in the viewport.

## Requirements

- `getVisibleItems({ items, itemHeight, viewportHeight, scrollTop })` returns `{ startIndex, endIndex, visibleItems, offsetY }`
- `startIndex` — first visible item index
- `endIndex` — last visible item index (exclusive)
- `visibleItems` — the slice of items that should be rendered
- `offsetY` — the CSS `transform: translateY()` offset to position the rendered items correctly
- Add 1 buffer item above and below for smooth scrolling

## Example

```js
const items = Array.from({ length: 1000 }, (_, i) => ({ id: i }));

getVisibleItems({
  items,
  itemHeight: 50,
  viewportHeight: 200,
  scrollTop: 100,
});
// startIndex: 1 (with buffer), endIndex: 6 (with buffer)
// visibleItems: items[1..6]
// offsetY: 50 (pixels to push items down)
```

## Why This Comes Up in Interviews

Virtual lists are the key performance optimization for rendering large datasets — used in every table library (AG Grid, react-virtual, react-window). Senior FE engineers are expected to understand the math behind them.

## What You Need to Know

- `Math.floor(scrollTop / itemHeight)` — first visible index
- `Math.ceil(viewportHeight / itemHeight)` — number of visible items
- Buffer items for smooth scroll
- `offsetY = startIndex * itemHeight` — CSS offset
