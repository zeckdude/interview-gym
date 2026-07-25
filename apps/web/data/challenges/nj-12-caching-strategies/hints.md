1. Store cache entries in a `Map` keyed by `key`, saving both the `value` and the `clock()` timestamp when it was cached.
2. `no-store` should skip the map entirely — don't even check it before calling `fetcher()`.
3. An entry is still valid when `revalidate` is `undefined` (never expires) OR `clock() - cachedAt < revalidate * 1000` — get the comparison direction right or everything will look expired immediately.
