export const starterTs = `interface MockRequest {
  pathname: string;
  cookies: Record<string, string>;
}

interface MiddlewareResult {
  type: 'next' | 'redirect';
  destination?: string;
}

const PROTECTED_PATHS = ['/dashboard', '/settings'];

function middleware(request: MockRequest): MiddlewareResult {
  // Redirect unauthenticated users away from protected paths,
  // and redirect authenticated users away from /login.

  return { type: 'next' };
}

export { middleware, PROTECTED_PATHS };`;

export const starterJs = `const PROTECTED_PATHS = ['/dashboard', '/settings'];

function middleware(request) {
  // Redirect unauthenticated users away from protected paths,
  // and redirect authenticated users away from /login.

  return { type: 'next' };
}

module.exports = { middleware, PROTECTED_PATHS };`;

export const solutionTs = `interface MockRequest {
  pathname: string;
  cookies: Record<string, string>;
}

interface MiddlewareResult {
  type: 'next' | 'redirect';
  destination?: string;
}

const PROTECTED_PATHS = ['/dashboard', '/settings'];

function isProtected(pathname: string): boolean {
  return PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(path + '/'));
}

function middleware(request: MockRequest): MiddlewareResult {
  const hasSession = Boolean(request.cookies.session);

  if (isProtected(request.pathname) && !hasSession) {
    return { type: 'redirect', destination: '/login' };
  }

  if (request.pathname === '/login' && hasSession) {
    return { type: 'redirect', destination: '/dashboard' };
  }

  return { type: 'next' };
}

export { middleware, PROTECTED_PATHS };`;

export const solutionJs = `const PROTECTED_PATHS = ['/dashboard', '/settings'];

function isProtected(pathname) {
  return PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(path + '/'));
}

function middleware(request) {
  const hasSession = Boolean(request.cookies.session);

  if (isProtected(request.pathname) && !hasSession) {
    return { type: 'redirect', destination: '/login' };
  }

  if (request.pathname === '/login' && hasSession) {
    return { type: 'redirect', destination: '/dashboard' };
  }

  return { type: 'next' };
}

module.exports = { middleware, PROTECTED_PATHS };`;
