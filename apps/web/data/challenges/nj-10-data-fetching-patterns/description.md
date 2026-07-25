# Data Fetching: Waterfall vs Parallel

## What You're Building

Awaiting one fetch, then starting the next, creates a **request waterfall** — each fetch waits for the previous one to fully finish before it even starts. Fix `loadDashboardData()` so independent requests run **in parallel** instead.

## Requirements

- `getUser(userId)` and `getStats()` are independent — neither needs the other's result
- `loadDashboardData(userId)` must call **both** and return `{ user, stats }`
- Both requests must be **started** before either one finishes — don't `await` one before calling the other
- `Promise.all` (or starting both promises before awaiting) is the standard fix

> **Expected Output**
>
> Both `getUser` and `getStats` should have started before either one completes — that's the signal that they ran in parallel, not one-after-another.

## Example

```ts
// ❌ Waterfall — stats doesn't start until user finishes
async function loadDashboardData(userId) {
  const user = await getUser(userId);
  const stats = await getStats();
  return { user, stats };
}

// ✅ Parallel — both start immediately
async function loadDashboardData(userId) {
  const [user, stats] = await Promise.all([getUser(userId), getStats()]);
  return { user, stats };
}
```

## Why This Comes Up in Interviews

Waterfalls are the single most common Next.js performance bug — and they're invisible in code review unless you're specifically looking for sequential `await`s that don't actually depend on each other. Interviewers ask this to see if you instinctively reach for `Promise.all`.

## What You Need to Know

- `await` pauses the function — if the next line doesn't need that result, you've created an unnecessary bottleneck
- `Promise.all([a, b])` starts both promises immediately and waits for both to settle
- Waterfalls **are** correct when one fetch genuinely depends on another's result (e.g. fetch a user, then fetch that user's orders)
- Server Components make it easy to accidentally create waterfalls across nested components — each one fetching independently in sequence down the tree
