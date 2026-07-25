export const starterTs = `interface RouteConfig {
  dynamic?: 'auto' | 'force-dynamic' | 'force-static';
  usesCookies?: boolean;
  usesHeaders?: boolean;
  usesSearchParams?: boolean;
  fetchCache?: 'default-cache' | 'no-store' | 'force-cache';
  revalidate?: number | false;
}

function determineRenderMode(config: RouteConfig): 'static' | 'dynamic' {
  // Implement the render mode decision here.

  return 'static';
}

export { determineRenderMode };`;

export const starterJs = `function determineRenderMode(config) {
  // Implement the render mode decision here.

  return 'static';
}

module.exports = { determineRenderMode };`;

export const solutionTs = `interface RouteConfig {
  dynamic?: 'auto' | 'force-dynamic' | 'force-static';
  usesCookies?: boolean;
  usesHeaders?: boolean;
  usesSearchParams?: boolean;
  fetchCache?: 'default-cache' | 'no-store' | 'force-cache';
  revalidate?: number | false;
}

function determineRenderMode(config: RouteConfig): 'static' | 'dynamic' {
  if (config.dynamic === 'force-static') return 'static';
  if (config.dynamic === 'force-dynamic') return 'dynamic';

  const isDynamic =
    Boolean(config.usesCookies) ||
    Boolean(config.usesHeaders) ||
    Boolean(config.usesSearchParams) ||
    config.fetchCache === 'no-store' ||
    config.revalidate === 0;

  return isDynamic ? 'dynamic' : 'static';
}

export { determineRenderMode };`;

export const solutionJs = `function determineRenderMode(config) {
  if (config.dynamic === 'force-static') return 'static';
  if (config.dynamic === 'force-dynamic') return 'dynamic';

  const isDynamic =
    Boolean(config.usesCookies) ||
    Boolean(config.usesHeaders) ||
    Boolean(config.usesSearchParams) ||
    config.fetchCache === 'no-store' ||
    config.revalidate === 0;

  return isDynamic ? 'dynamic' : 'static';
}

module.exports = { determineRenderMode };`;
