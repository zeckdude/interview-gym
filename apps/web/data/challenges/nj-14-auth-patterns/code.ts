export const starterTs = `interface Session {
  userId: string;
  role: 'user' | 'admin';
}

function resolveAuthRedirect(path: string, session: Session | null): string | null {
  return null;
}

export { resolveAuthRedirect };`;

export const starterJs = `function resolveAuthRedirect(path, session): string | null {
  return null;
}

module.exports = { resolveAuthRedirect };`;

export const solutionTs = `interface Session {
  userId: string;
  role: 'user' | 'admin';
}

function resolveAuthRedirect(path: string, session: Session | null): string | null {
  if (path.startsWith('/api/public/') || path === '/signup') return null;
  if (path === '/login') return session ? '/dashboard' : null;
  if (path.startsWith('/admin/')) {
    if (!session) return '/login?redirect=' + encodeURIComponent(path);
    if (session.role !== 'admin') return '/dashboard';
    return null;
  }
  if (path.startsWith('/dashboard/')) {
    if (!session) return '/login?redirect=' + encodeURIComponent(path);
    return null;
  }
  return null;
}

export { resolveAuthRedirect };`;

export const solutionJs = `function resolveAuthRedirect(path, session): string | null {
  if (path.startsWith('/api/public/') || path === '/signup') return null;
  if (path === '/login') return session ? '/dashboard' : null;
  if (path.startsWith('/admin/')) {
    if (!session) return '/login?redirect=' + encodeURIComponent(path);
    if (session.role !== 'admin') return '/dashboard';
    return null;
  }
  if (path.startsWith('/dashboard/')) {
    if (!session) return '/login?redirect=' + encodeURIComponent(path);
    return null;
  }
  return null;
}

module.exports = { resolveAuthRedirect };`;
