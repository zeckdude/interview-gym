import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

type Context = Record<string, unknown>;
type Next = () => Promise<void>;
type Middleware = (ctx: Context, next: Next) => Promise<void> | void;

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createMiddlewareChain = getExport<(...mws: Middleware[]) => (ctx: Context) => Promise<void>>(
      exports,
      'createMiddlewareChain'
    );

    // Test 1: executes middlewares in order
    const ctx1: Context = {};
    const chain1 = createMiddlewareChain(
      async (ctx, next) => { (ctx.log as string[]).push('a'); await next(); },
      async (ctx, next) => { (ctx.log as string[]).push('b'); await next(); },
      async (ctx) => { (ctx.log as string[]).push('c'); }
    );
    ctx1.log = [];
    await chain1(ctx1);
    const test1 = JSON.stringify(ctx1.log) === '["a","b","c"]';

    // Test 2: onion model (code after next runs in reverse)
    const ctx2: Context = { log: [] };
    const chain2 = createMiddlewareChain(
      async (ctx, next) => { (ctx.log as string[]).push('before'); await next(); (ctx.log as string[]).push('after'); },
      async (ctx) => { (ctx.log as string[]).push('inner'); }
    );
    await chain2(ctx2);
    const test2 = JSON.stringify(ctx2.log) === '["before","inner","after"]';

    // Test 3: stopping chain (no next call)
    const ctx3: Context = { log: [] };
    const chain3 = createMiddlewareChain(
      async (ctx) => { (ctx.log as string[]).push('first'); },
      async (ctx) => { (ctx.log as string[]).push('second'); }
    );
    await chain3(ctx3);
    const test3 = JSON.stringify(ctx3.log) === '["first"]';

    return {
      passed: test1 && test2 && test3,
      results: [
        { description: 'Executes middlewares in order', expected: '["a","b","c"]', actual: JSON.stringify(ctx1.log), passed: test1 },
        { description: 'Onion model: after-next runs in reverse', expected: '["before","inner","after"]', actual: JSON.stringify(ctx2.log), passed: test2 },
        { description: 'Chain stops if next() not called', expected: '["first"]', actual: JSON.stringify(ctx3.log), passed: test3 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
