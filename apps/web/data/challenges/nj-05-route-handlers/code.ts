export const starterTs = `interface MockRequest {
  headers: { authorization?: string };
}

interface MockResponse {
  status: number;
  body: unknown;
}

const VALID_TOKEN = 'secret-token-123';

function GET(request: MockRequest): MockResponse {
  // Check the authorization header and return the right status/body.

  return { status: 401, body: { error: 'Unauthorized' } };
}

export { GET, VALID_TOKEN };`;

export const starterJs = `const VALID_TOKEN = 'secret-token-123';

function GET(request) {
  // Check the authorization header and return the right status/body.

  return { status: 401, body: { error: 'Unauthorized' } };
}

module.exports = { GET, VALID_TOKEN };`;

export const solutionTs = `interface MockRequest {
  headers: { authorization?: string };
}

interface MockResponse {
  status: number;
  body: unknown;
}

const VALID_TOKEN = 'secret-token-123';

function GET(request: MockRequest): MockResponse {
  const auth = request.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    return { status: 401, body: { error: 'Unauthorized' } };
  }

  const token = auth.slice(7);
  if (token !== VALID_TOKEN) {
    return { status: 401, body: { error: 'Unauthorized' } };
  }

  return { status: 200, body: { data: ['item1', 'item2'] } };
}

export { GET, VALID_TOKEN };`;

export const solutionJs = `const VALID_TOKEN = 'secret-token-123';

function GET(request) {
  const auth = request.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    return { status: 401, body: { error: 'Unauthorized' } };
  }

  const token = auth.slice(7);
  if (token !== VALID_TOKEN) {
    return { status: 401, body: { error: 'Unauthorized' } };
  }

  return { status: 200, body: { data: ['item1', 'item2'] } };
}

module.exports = { GET, VALID_TOKEN };`;
