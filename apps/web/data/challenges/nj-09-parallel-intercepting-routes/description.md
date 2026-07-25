# Parallel Routes and Modal Patterns

## What You're Building

Instagram-style "click a photo, get a modal — but refresh the URL and get a full page" is built with two special App Router conventions: **parallel routes** (`@slot` folders) and **intercepting routes** (`(.)`, `(..)`, `(...)` folders). Implement `isParallelSlot()` and `parseInterceptingRoute()` to parse both.

## Requirements

- `isParallelSlot(folderName)` returns `true` if the folder name starts with `@` (a parallel route slot, like `@modal`)
- `parseInterceptingRoute(folderName)` parses the intercepting-route prefix and returns `{ level, segment }`, or `null` if the folder doesn't use one
  - `(.)photo` → same level → `{ level: 'same', segment: 'photo' }`
  - `(..)photo` → one level up → `{ level: 'one-above', segment: 'photo' }`
  - `(..)(..)photo` → two levels up → `{ level: 'two-above', segment: 'photo' }`
  - `(...)photo` → from the root → `{ level: 'root', segment: 'photo' }`
  - anything without a matching prefix → `null`

> **Expected Output**
>
> `parseInterceptingRoute('(..)photo')` → `{ level: 'one-above', segment: 'photo' }`

## Example

```ts
isParallelSlot('@modal');   // true
isParallelSlot('photo');    // false

parseInterceptingRoute('(.)photo');       // { level: 'same', segment: 'photo' }
parseInterceptingRoute('(...)photo');     // { level: 'root', segment: 'photo' }
parseInterceptingRoute('photo');          // null
```

## Why This Comes Up in Interviews

This is the pattern interviewers reach for when they want to know if you've built something beyond a basic CRUD app. Modals-that-are-also-real-pages, tabbed dashboards with independent loading states, and "@analytics" style parallel panels all rely on these two folder conventions.

## What You Need to Know

- `@slot` folders render in parallel, side-by-side, inside the same layout — each slot is its own mini page tree
- `(.)`, `(..)`, `(..)(..)`, and `(...)` all "intercept" a route so it renders in the **current layout** (e.g. as a modal) instead of navigating away — but a hard refresh loads the real destination route
- The dots mirror relative file-path conventions: one dot = same folder, two dots = up one, three dots = the root
- Parallel routes need a `default.tsx` in each slot to render when there's no matching state
