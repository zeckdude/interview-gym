import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

type Handler = (params: Record<string, string>) => string;

interface Router {
  get(path: string, handler: Handler): void;
  post(path: string, handler: Handler): void;
  match(method: string, path: string): ((params?: Record<string, string>) => string) | null;
}

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createRouter = getExport<() => Router>(exports, 'createRouter');

    // Test 1: static route match
    const r1 = createRouter();
    r1.get('/health', () => 'ok');
    const h1 = r1.match('GET', '/health');
    const test1 = h1 !== null && h1({}) === 'ok';

    // Test 2: dynamic route with param
    const r2 = createRouter();
    r2.get('/users/:id', ({ id }) => `user:${id}`);
    const h2 = r2.match('GET', '/users/42');
    const result2 = h2 ? h2({}) : '';
    const test2 = result2 === 'user:42';

    // Test 3: no match returns null
    const r3 = createRouter();
    r3.get('/foo', () => 'foo');
    const h3 = r3.match('GET', '/bar');
    const test3 = h3 === null;

    // Test 4: method matters
    const r4 = createRouter();
    r4.post('/login', () => 'logged in');
    const h4get = r4.match('GET', '/login');
    const h4post = r4.match('POST', '/login');
    const test4 = h4get === null && h4post !== null;

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'Matches static route', expected: '"ok"', actual: h1 ? String(h1({})) : 'null', passed: test1 },
        { description: 'Matches dynamic :param route', expected: '"user:42"', actual: result2, passed: test2 },
        { description: 'Returns null for unregistered route', expected: 'null', actual: String(h3), passed: test3 },
        { description: 'Method must match (GET vs POST)', expected: 'GET: null, POST: handler', actual: `GET:${h4get}, POST:${h4post ? 'fn' : 'null'}`, passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
