export const starterTs = `function matchMiddlewarePath(pathname: string, pattern: string) {
  // Implement this function
  
}

export { matchMiddlewarePath };`;

export const starterJs = `function matchMiddlewarePath(pathname, pattern) {
  // Implement this function
  
}

module.exports = { matchMiddlewarePath };`;

export const solutionTs = `function matchMiddlewarePath(pathname: string, pattern: string) {
  if (pattern === '/:path*') return true;
    if (pattern.endsWith('/:path*')) {
      const prefix = pattern.slice(0, -('/:path*'.length));
      return pathname === prefix || pathname.startsWith(prefix + '/');
    }
    if (pattern.includes(':')) {
      const patternParts = pattern.split('/');
      const pathParts = pathname.split('/');
      if (patternParts.length !== pathParts.length) return false;
      return patternParts.every((part, i) => part.startsWith(':') || part === pathParts[i]);
    }
    return pathname === pattern;
}

export { matchMiddlewarePath };`;

export const solutionJs = `function matchMiddlewarePath(pathname, pattern) {
  if (pattern === '/:path*') return true;
    if (pattern.endsWith('/:path*')) {
      const prefix = pattern.slice(0, -('/:path*'.length));
      return pathname === prefix || pathname.startsWith(prefix + '/');
    }
    if (pattern.includes(':')) {
      const patternParts = pattern.split('/');
      const pathParts = pathname.split('/');
      if (patternParts.length !== pathParts.length) return false;
      return patternParts.every((part, i) => part.startsWith(':') || part === pathParts[i]);
    }
    return pathname === pattern;
}

module.exports = { matchMiddlewarePath };`;
