export const starterTs = `type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

function createLazyLoader<T>(loader: () => Promise<T>) {
  // Implement lazy loading with caching

  return {
    load(): Promise<T> { return loader(); },
    getStatus(): LoadStatus { return 'idle'; },
    getModule(): T | null { return null; },
    reset(): void {},
  };
}

export { createLazyLoader };`;

export const starterJs = `function createLazyLoader(loader) {
  // Implement lazy loading with caching

  return {
    load() { return loader(); },
    getStatus() { return 'idle'; },
    getModule() { return null; },
    reset() {},
  };
}

module.exports = { createLazyLoader };`;

export const solutionTs = `type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

function createLazyLoader<T>(loader: () => Promise<T>) {
  let status: LoadStatus = 'idle';
  let module: T | null = null;
  let pending: Promise<T> | null = null;

  return {
    load(): Promise<T> {
      if (status === 'loaded') return Promise.resolve(module as T);
      if (status === 'loading' && pending) return pending;
      status = 'loading';
      pending = loader().then(m => {
        module = m; status = 'loaded'; pending = null; return m;
      }).catch(err => {
        status = 'error'; pending = null; throw err;
      });
      return pending;
    },
    getStatus(): LoadStatus { return status; },
    getModule(): T | null { return module; },
    reset(): void { status = 'idle'; module = null; pending = null; },
  };
}

export { createLazyLoader };`;

export const solutionJs = `function createLazyLoader(loader) {
  let status = 'idle';
  let module = null;
  let pending = null;

  return {
    load() {
      if (status === 'loaded') return Promise.resolve(module);
      if (status === 'loading' && pending) return pending;
      status = 'loading';
      pending = loader().then(m => {
        module = m; status = 'loaded'; pending = null; return m;
      }).catch(err => {
        status = 'error'; pending = null; throw err;
      });
      return pending;
    },
    getStatus() { return status; },
    getModule() { return module; },
    reset() { status = 'idle'; module = null; pending = null; },
  };
}

module.exports = { createLazyLoader };`;
