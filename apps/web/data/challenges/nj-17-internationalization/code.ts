export const starterTs = `const LOCALES = ['en', 'es'] as const;

function localizePath(path: string, locale: 'en' | 'es'): string {
  return path;
}

export { localizePath };`;

export const starterJs = `const LOCALES = ['en', 'es'];

function localizePath(path, locale): string {
  return path;
}

module.exports = { localizePath };`;

export const solutionTs = `const LOCALES = ['en', 'es'] as const;

function localizePath(path: string, locale: 'en' | 'es'): string {
  let normalized = path.startsWith('/') ? path : '/' + path;
  for (const loc of LOCALES) {
    if (normalized === '/' + loc) return '/' + locale;
    if (normalized.startsWith('/' + loc + '/')) {
      normalized = normalized.slice(('/' + loc).length) || '/';
      break;
    }
  }
  if (normalized === '/') return '/' + locale;
  return '/' + locale + normalized;
}

export { localizePath };`;

export const solutionJs = `const LOCALES = ['en', 'es'];

function localizePath(path, locale): string {
  let normalized = path.startsWith('/') ? path : '/' + path;
  for (const loc of LOCALES) {
    if (normalized === '/' + loc) return '/' + locale;
    if (normalized.startsWith('/' + loc + '/')) {
      normalized = normalized.slice(('/' + loc).length) || '/';
      break;
    }
  }
  if (normalized === '/') return '/' + locale;
  return '/' + locale + normalized;
}

module.exports = { localizePath };`;
