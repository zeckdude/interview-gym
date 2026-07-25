import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface MockRequest {
  headers: { authorization?: string };
}

interface MockResponse {
  status: number;
  body: unknown;
}

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const GET = getExport<(request: MockRequest) => MockResponse>(exports, 'GET');

    const noAuth = GET({ headers: {} });
    const test1 = noAuth.status === 401;

    const wrongToken = GET({ headers: { authorization: 'Bearer nope' } });
    const test2 = wrongToken.status === 401;

    const noPrefix = GET({ headers: { authorization: 'secret-token-123' } });
    const test3 = noPrefix.status === 401;

    const valid = GET({ headers: { authorization: 'Bearer secret-token-123' } });
    const test4 = valid.status === 200;
    const test5 = Array.isArray((valid.body as { data?: unknown[] })?.data) &&
      (valid.body as { data: unknown[] }).data.length === 2;

    return {
      passed: test1 && test2 && test3 && test4 && test5,
      results: [
        { description: 'Missing authorization header → 401', expected: '401', actual: String(noAuth.status), passed: test1 },
        { description: 'Wrong bearer token → 401', expected: '401', actual: String(wrongToken.status), passed: test2 },
        { description: 'Missing "Bearer " prefix → 401', expected: '401', actual: String(noPrefix.status), passed: test3 },
        { description: 'Valid bearer token → 200', expected: '200', actual: String(valid.status), passed: test4 },
        { description: 'Valid response includes the data array', expected: '["item1","item2"]', actual: JSON.stringify(valid.body), passed: test5 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
