import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface MockRequest {
  pathname: string;
  cookies: Record<string, string>;
}

interface MiddlewareResult {
  type: 'next' | 'redirect';
  destination?: string;
}

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const middleware = getExport<(request: MockRequest) => MiddlewareResult>(exports, 'middleware');

    const r1 = middleware({ pathname: '/dashboard', cookies: {} });
    const test1 = r1.type === 'redirect' && r1.destination === '/login';

    const r2 = middleware({ pathname: '/dashboard', cookies: { session: 'abc123' } });
    const test2 = r2.type === 'next';

    const r3 = middleware({ pathname: '/login', cookies: { session: 'abc123' } });
    const test3 = r3.type === 'redirect' && r3.destination === '/dashboard';

    const r4 = middleware({ pathname: '/about', cookies: {} });
    const test4 = r4.type === 'next';

    const r5 = middleware({ pathname: '/settings/profile', cookies: {} });
    const test5 = r5.type === 'redirect' && r5.destination === '/login';

    return {
      passed: test1 && test2 && test3 && test4 && test5,
      results: [
        { description: 'Protected path without session redirects to /login', expected: 'redirect → /login', actual: JSON.stringify(r1), passed: test1 },
        { description: 'Protected path with session passes through', expected: 'next', actual: JSON.stringify(r2), passed: test2 },
        { description: 'Logged-in user visiting /login redirects to /dashboard', expected: 'redirect → /dashboard', actual: JSON.stringify(r3), passed: test3 },
        { description: 'Public path always passes through', expected: 'next', actual: JSON.stringify(r4), passed: test4 },
        { description: 'Nested protected path is also protected', expected: 'redirect → /login', actual: JSON.stringify(r5), passed: test5 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
