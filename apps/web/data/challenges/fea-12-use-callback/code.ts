export const starterTs = `function createMemoHook() {
  // Implement useMemo/useCallback-like caching

  return {
    memo<T>(factory: () => T, deps: unknown[]): T {
      return factory();
    },
  };
}

export { createMemoHook };`;

export const starterJs = `function createMemoHook() {
  // Implement useMemo/useCallback-like caching

  return {
    memo(factory, deps) {
      return factory();
    },
  };
}

module.exports = { createMemoHook };`;

export const solutionTs = `function createMemoHook() {
  let prevDeps: unknown[] | null = null;
  let cached: unknown;

  function depsEqual(a: unknown[], b: unknown[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((v, i) => v === b[i]);
  }

  return {
    memo<T>(factory: () => T, deps: unknown[]): T {
      if (prevDeps === null || !depsEqual(prevDeps, deps)) {
        cached = factory();
        prevDeps = deps;
      }
      return cached as T;
    },
  };
}

export { createMemoHook };`;

export const solutionJs = `function createMemoHook() {
  let prevDeps = null;
  let cached;

  function depsEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => v === b[i]);
  }

  return {
    memo(factory, deps) {
      if (prevDeps === null || !depsEqual(prevDeps, deps)) {
        cached = factory();
        prevDeps = deps;
      }
      return cached;
    },
  };
}

module.exports = { createMemoHook };`;
