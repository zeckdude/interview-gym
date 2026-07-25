# LRU Cache

## What You're Building

Implement an `LRUCache` class — a Least Recently Used cache with a fixed capacity that evicts the least recently accessed item when full.

## Requirements

- `new LRUCache(capacity)` — creates a cache with a max size
- `get(key)` — returns the value, or `-1` if not found; marks item as recently used
- `put(key, value)` — inserts or updates a value; evicts the LRU item if at capacity
- `get` and `put` must both run in **O(1)** average time

## Example

```js
const cache = new LRUCache(2);

cache.put(1, 1);
cache.put(2, 2);
cache.get(1);    // → 1 (now most recently used)
cache.put(3, 3); // evicts key 2 (least recently used)
cache.get(2);    // → -1 (evicted)
cache.get(3);    // → 3
```

## Why This Comes Up in Interviews

LRU Cache is one of the most common hard interview questions across FAANG and high-growth companies. It requires you to combine a hash map with a doubly linked list to achieve O(1) operations. JavaScript's `Map` preserves insertion order, which makes this more elegant in JS than in other languages.

## What You Need to Know

- `Map` preserves insertion order — use `map.keys()` to find the oldest key
- Delete + re-insert to mark as "recently used"
- Capacity tracking
- The `Map.prototype.keys().next().value` trick to find oldest entry
