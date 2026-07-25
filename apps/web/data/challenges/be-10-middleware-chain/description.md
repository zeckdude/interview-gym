# Middleware Chain

## What You're Building

Implement a `createMiddlewareChain` function that composes a sequence of middleware functions — just like Express.js middleware, but framework-free.

## Requirements

- `createMiddlewareChain(...middlewares)` returns a `run(ctx)` function
- Each middleware receives `(ctx, next)` where `ctx` is a shared context object and `next()` calls the next middleware
- Middleware can be async
- If a middleware doesn't call `next()`, the chain stops
- Middleware can modify `ctx` before calling `next()` and inspect it after

## Example

```js
const chain = createMiddlewareChain(
  async (ctx, next) => {
    ctx.log = ['start'];
    await next();
    ctx.log.push('end');
  },
  async (ctx, next) => {
    ctx.log.push('middle');
    await next();
  },
  async (ctx) => {
    ctx.log.push('done');
  }
);

const ctx = {};
await chain(ctx);
// ctx.log → ['start', 'middle', 'done', 'end']
```

## Why This Comes Up in Interviews

Middleware composition is the backbone of Express, Koa, and many Redux patterns. Understanding how `next()` works — and how to implement it — is essential for senior backend and full-stack engineers.

## What You Need to Know

- Recursive async composition
- Closures that capture the middleware index
- Koa-style "onion" model: code before `next()` runs in order, code after runs in reverse
