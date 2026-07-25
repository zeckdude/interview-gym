1. Call both `getUser(userId)` and `getStats()` first — without `await` — to get two Promise objects, then await them together.
2. `Promise.all([getUser(userId), getStats()])` returns an array of results in the same order you passed the promises in.
3. If you `await getUser(userId)` on its own line before calling `getStats()`, you've recreated the waterfall even if you eventually get the right data.
