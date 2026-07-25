export const starterTs = `type Handler = (params: Record<string, string>) => string;

interface Router {
  get(path: string, handler: Handler): void;
  post(path: string, handler: Handler): void;
  match(method: string, path: string): Handler | null;
}

function createRouter(): Router {
  // Store routes and implement matching here

  return {
    get(path, handler) {},
    post(path, handler) {},
    match(method, path) {
      return null;
    },
  };
}

export { createRouter };`;

export const starterJs = `function createRouter() {
  // Store routes and implement matching here

  return {
    get(path, handler) {},
    post(path, handler) {},
    match(method, path) {
      return null;
    },
  };
}

module.exports = { createRouter };`;

export const solutionTs = `type Handler = (params: Record<string, string>) => string;

interface Route {
  method: string;
  pattern: RegExp;
  paramNames: string[];
  handler: Handler;
}

interface Router {
  get(path: string, handler: Handler): void;
  post(path: string, handler: Handler): void;
  match(method: string, path: string): Handler | null;
}

function createRouter(): Router {
  const routes: Route[] = [];

  function register(method: string, path: string, handler: Handler) {
    const paramNames: string[] = [];
    const regexStr = path.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    const pattern = new RegExp('^' + regexStr + '$');
    routes.push({ method: method.toUpperCase(), pattern, paramNames, handler });
  }

  return {
    get(path, handler) { register('GET', path, handler); },
    post(path, handler) { register('POST', path, handler); },
    match(method, path) {
      for (const route of routes) {
        if (route.method !== method.toUpperCase()) continue;
        const m = route.pattern.exec(path);
        if (!m) continue;
        const params: Record<string, string> = {};
        route.paramNames.forEach((name, i) => { params[name] = m[i + 1]; });
        // Close over extracted params — callers may invoke with {}.
        return () => route.handler(params);
      }
      return null;
    },
  };
}

export { createRouter };`;

export const solutionJs = `function createRouter() {
  const routes = [];

  function register(method, path, handler) {
    const paramNames = [];
    const regexStr = path.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    const pattern = new RegExp('^' + regexStr + '$');
    routes.push({ method: method.toUpperCase(), pattern, paramNames, handler });
  }

  return {
    get(path, handler) { register('GET', path, handler); },
    post(path, handler) { register('POST', path, handler); },
    match(method, path) {
      for (const route of routes) {
        if (route.method !== method.toUpperCase()) continue;
        const m = route.pattern.exec(path);
        if (!m) continue;
        const params = {};
        route.paramNames.forEach((name, i) => { params[name] = m[i + 1]; });
        return () => route.handler(params);
      }
      return null;
    },
  };
}

module.exports = { createRouter };`;
