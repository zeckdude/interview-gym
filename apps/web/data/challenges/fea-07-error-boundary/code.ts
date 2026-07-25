export const starterTs = `function createErrorBoundary<F>(options: { fallback: F }) {
  // Implement error boundary logic

  return {
    render<R>(renderFn: () => R): R | F {
      return renderFn();
    },
    hasError(): boolean { return false; },
    getError(): Error | null { return null; },
  };
}

export { createErrorBoundary };`;

export const starterJs = `function createErrorBoundary({ fallback }) {
  // Implement error boundary logic

  return {
    render(renderFn) {
      return renderFn();
    },
    hasError() { return false; },
    getError() { return null; },
  };
}

module.exports = { createErrorBoundary };`;

export const solutionTs = `function createErrorBoundary<F>(options: { fallback: F }) {
  let caughtError: Error | null = null;

  return {
    render<R>(renderFn: () => R): R | F {
      try {
        const result = renderFn();
        caughtError = null;
        return result;
      } catch (err) {
        caughtError = err instanceof Error ? err : new Error(String(err));
        return options.fallback;
      }
    },
    hasError(): boolean { return caughtError !== null; },
    getError(): Error | null { return caughtError; },
  };
}

export { createErrorBoundary };`;

export const solutionJs = `function createErrorBoundary({ fallback }) {
  let caughtError = null;

  return {
    render(renderFn) {
      try {
        const result = renderFn();
        caughtError = null;
        return result;
      } catch (err) {
        caughtError = err instanceof Error ? err : new Error(String(err));
        return fallback;
      }
    },
    hasError() { return caughtError !== null; },
    getError() { return caughtError; },
  };
}

module.exports = { createErrorBoundary };`;
