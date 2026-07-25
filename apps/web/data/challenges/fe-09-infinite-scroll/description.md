# Infinite Scroll

## What You're Building

Implement `createInfiniteScroller` — the core logic for infinite scrolling without a framework. It uses `IntersectionObserver` to detect when a sentinel element enters the viewport and triggers data loading.

## Requirements

- `createInfiniteScroller({ sentinel, onLoadMore, threshold? })` sets up an observer
- `sentinel` — a DOM element at the bottom of the list (the "load more" trigger)
- `onLoadMore()` — async callback that loads the next page
- Prevents concurrent loads (if already loading, ignore intersection)
- Returns a `destroy()` function to disconnect the observer
- `threshold` defaults to 0.1

## Example

```js
const scroller = createInfiniteScroller({
  sentinel: document.querySelector('#load-trigger'),
  onLoadMore: async () => {
    const newItems = await fetchNextPage();
    appendItemsToList(newItems);
  },
});

// Later:
scroller.destroy(); // cleanup
```

## Why This Comes Up in Interviews

Infinite scroll is a core UX pattern in every social feed, e-commerce page, and dashboard. Implementing it correctly — with loading prevention and cleanup — shows production-level thinking.

## What You Need to Know

- `IntersectionObserver` API
- Preventing duplicate loads with a loading flag
- Cleanup: `observer.disconnect()`
- Async callback handling
