export const starterTs = `type Context = Record<string, unknown>;
type Next = () => Promise<void>;
type Middleware = (ctx: Context, next: Next) => Promise<void> | void;

function createMiddlewareChain(...middlewares: Middleware[]) {
  return async function run(ctx: Context): Promise<void> {
    // Implement middleware chain here
    
  };
}

export { createMiddlewareChain };`;

export const starterJs = `function createMiddlewareChain(...middlewares) {
  return async function run(ctx) {
    // Implement middleware chain here
    
  };
}

module.exports = { createMiddlewareChain };`;

export const solutionTs = `type Context = Record<string, unknown>;
type Next = () => Promise<void>;
type Middleware = (ctx: Context, next: Next) => Promise<void> | void;

function createMiddlewareChain(...middlewares: Middleware[]) {
  return async function run(ctx: Context): Promise<void> {
    let index = -1;

    async function dispatch(i: number): Promise<void> {
      if (i <= index) throw new Error('next() called multiple times');
      index = i;
      const fn = middlewares[i];
      if (!fn) return;
      await fn(ctx, () => dispatch(i + 1));
    }

    return dispatch(0);
  };
}

export { createMiddlewareChain };`;

export const solutionJs = `function createMiddlewareChain(...middlewares) {
  return async function run(ctx) {
    let index = -1;

    async function dispatch(i) {
      if (i <= index) throw new Error('next() called multiple times');
      index = i;
      const fn = middlewares[i];
      if (!fn) return;
      await fn(ctx, () => dispatch(i + 1));
    }

    return dispatch(0);
  };
}

module.exports = { createMiddlewareChain };`;
