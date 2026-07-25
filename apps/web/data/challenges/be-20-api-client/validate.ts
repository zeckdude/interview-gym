import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface ApiClient {
  get<T>(path: string, headers?: Record<string, string>): Promise<T>;
  post<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T>;
  put<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T>;
  delete<T>(path: string, headers?: Record<string, string>): Promise<T>;
}

export async function validate(userCode: string) {
  const previousFetch = globalThis.fetch;

  try {
    const fetchCalls: Array<{ url: string; options: RequestInit }> = [];
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const options = init ?? {};
      fetchCalls.push({ url, options });
      const body = { result: 'mocked', url, method: options.method ?? 'GET' };
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => body,
      } as Response;
    }) as typeof fetch;

    const exports = executeUserCode(userCode, () => ({}));

    const createApiClient = getExport<(opts: { baseUrl: string; headers?: Record<string, string> }) => ApiClient>(
      exports,
      'createApiClient'
    );

    fetchCalls.length = 0;
    const client = createApiClient({ baseUrl: 'https://api.test.com' });
    await client.get('/users');
    const test1 = fetchCalls.length === 1 && fetchCalls[0].url === 'https://api.test.com/users';

    fetchCalls.length = 0;
    await client.post('/users', { name: 'Alice' });
    const call2 = fetchCalls[0];
    const headers2 = (call2?.options?.headers ?? {}) as Record<string, string>;
    const test2 = call2?.options?.method === 'POST' && headers2['Content-Type'] === 'application/json';

    fetchCalls.length = 0;
    const authedClient = createApiClient({
      baseUrl: 'https://api.test.com',
      headers: { Authorization: 'Bearer token' },
    });
    await authedClient.get('/me');
    const headers3 = (fetchCalls[0]?.options?.headers ?? {}) as Record<string, string>;
    const test3 = headers3['Authorization'] === 'Bearer token';

    const test4 =
      typeof client.get === 'function' &&
      typeof client.post === 'function' &&
      typeof client.put === 'function' &&
      typeof client.delete === 'function';

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        {
          description: 'GET request uses baseUrl + path',
          expected: 'https://api.test.com/users',
          actual: fetchCalls.length > 0 ? String(fetchCalls[0]?.url) : 'no call',
          passed: test1,
        },
        {
          description: 'POST sets method and Content-Type header',
          expected: 'POST + application/json',
          actual: `method=${call2?.options?.method}, CT=${headers2['Content-Type']}`,
          passed: test2,
        },
        {
          description: 'Default headers merged into every request',
          expected: 'Authorization: Bearer token',
          actual: `Authorization: ${headers3['Authorization']}`,
          passed: test3,
        },
        {
          description: 'Client has get/post/put/delete methods',
          expected: 'all functions',
          actual: test4 ? 'all present' : 'some missing',
          passed: test4,
        },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  } finally {
    globalThis.fetch = previousFetch;
  }
}
