export const starterTs = `interface RouteMatch {
  file: string | null;
  params: Record<string, string>;
}

function matchRoute(routes: string[], pathname: string): RouteMatch {
  // Implement App Router style matching here.
  // - static segments must match exactly
  // - [name] matches a single dynamic segment
  // - [...name] matches one or more remaining segments (must be last)
  // - (group) segments are ignored entirely

  return { file: null, params: {} };
}

export { matchRoute };`;

export const starterJs = `function matchRoute(routes, pathname) {
  // Implement App Router style matching here.
  // - static segments must match exactly
  // - [name] matches a single dynamic segment
  // - [...name] matches one or more remaining segments (must be last)
  // - (group) segments are ignored entirely

  return { file: null, params: {} };
}

module.exports = { matchRoute };`;

export const solutionTs = `interface RouteMatch {
  file: string | null;
  params: Record<string, string>;
}

function toSegments(filePath: string): string[] {
  return filePath
    .replace(/^app\\//, '')
    .replace(/\\/page\\.(tsx|jsx|ts|js)$/, '')
    .split('/')
    .filter((seg) => seg.length > 0 && !(seg.startsWith('(') && seg.endsWith(')')));
}

function matchRoute(routes: string[], pathname: string): RouteMatch {
  const urlSegments = pathname.split('/').filter(Boolean);

  for (const route of routes) {
    const routeSegments = toSegments(route);
    const params: Record<string, string> = {};
    let matched = true;

    for (let i = 0; i < routeSegments.length; i++) {
      const seg = routeSegments[i];

      if (seg.startsWith('[...') && seg.endsWith(']')) {
        const name = seg.slice(4, -1);
        const rest = urlSegments.slice(i);
        if (rest.length === 0) {
          matched = false;
          break;
        }
        params[name] = rest.join('/');
        // catch-all must be the final segment
        if (i !== routeSegments.length - 1) matched = false;
        break;
      }

      if (i >= urlSegments.length) {
        matched = false;
        break;
      }

      if (seg.startsWith('[') && seg.endsWith(']')) {
        params[seg.slice(1, -1)] = urlSegments[i];
        continue;
      }

      if (seg !== urlSegments[i]) {
        matched = false;
        break;
      }
    }

    const hasCatchAll = routeSegments.some((s) => s.startsWith('[...'));
    if (matched && !hasCatchAll && routeSegments.length !== urlSegments.length) {
      matched = false;
    }

    if (matched) {
      return { file: route, params };
    }
  }

  return { file: null, params: {} };
}

export { matchRoute };`;

export const solutionJs = `function toSegments(filePath) {
  return filePath
    .replace(/^app\\//, '')
    .replace(/\\/page\\.(tsx|jsx|ts|js)$/, '')
    .split('/')
    .filter((seg) => seg.length > 0 && !(seg.startsWith('(') && seg.endsWith(')')));
}

function matchRoute(routes, pathname) {
  const urlSegments = pathname.split('/').filter(Boolean);

  for (const route of routes) {
    const routeSegments = toSegments(route);
    const params = {};
    let matched = true;

    for (let i = 0; i < routeSegments.length; i++) {
      const seg = routeSegments[i];

      if (seg.startsWith('[...') && seg.endsWith(']')) {
        const name = seg.slice(4, -1);
        const rest = urlSegments.slice(i);
        if (rest.length === 0) {
          matched = false;
          break;
        }
        params[name] = rest.join('/');
        if (i !== routeSegments.length - 1) matched = false;
        break;
      }

      if (i >= urlSegments.length) {
        matched = false;
        break;
      }

      if (seg.startsWith('[') && seg.endsWith(']')) {
        params[seg.slice(1, -1)] = urlSegments[i];
        continue;
      }

      if (seg !== urlSegments[i]) {
        matched = false;
        break;
      }
    }

    const hasCatchAll = routeSegments.some((s) => s.startsWith('[...'));
    if (matched && !hasCatchAll && routeSegments.length !== urlSegments.length) {
      matched = false;
    }

    if (matched) {
      return { file: route, params };
    }
  }

  return { file: null, params: {} };
}

module.exports = { matchRoute };`;
