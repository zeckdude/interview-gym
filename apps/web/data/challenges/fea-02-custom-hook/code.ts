export const starterTs = `interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface FetchStore<T> {
  execute(url: string, options?: RequestInit): Promise<void>;
  getState(): FetchState<T>;
}

function createFetchState<T>(fetchFn = fetch): FetchStore<T> {
  // Implement fetch state manager here

  let state: FetchState<T> = { data: null, loading: false, error: null };

  return {
    async execute(_url, _options) {},
    getState() { return state; },
  };
}

export { createFetchState };`;

export const starterJs = `function createFetchState(fetchFn = fetch) {
  let state = { data: null, loading: false, error: null };

  return {
    async execute(url, options) {},
    getState() { return state; },
  };
}

module.exports = { createFetchState };`;

export const solutionTs = `interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function createFetchState<T>(fetchFn: typeof fetch = fetch) {
  let state: FetchState<T> = { data: null, loading: false, error: null };

  return {
    async execute(url: string, options?: RequestInit) {
      state = { data: null, loading: true, error: null };
      try {
        const res = await fetchFn(url, options);
        const data = await res.json() as T;
        state = { data, loading: false, error: null };
      } catch (err) {
        state = { data: null, loading: false, error: err instanceof Error ? err : new Error(String(err)) };
      }
    },
    getState() { return state; },
  };
}

export { createFetchState };`;

export const solutionJs = `function createFetchState(fetchFn = fetch) {
  let state = { data: null, loading: false, error: null };

  return {
    async execute(url, options) {
      state = { data: null, loading: true, error: null };
      try {
        const res = await fetchFn(url, options);
        const data = await res.json();
        state = { data, loading: false, error: null };
      } catch (err) {
        state = { data: null, loading: false, error: err instanceof Error ? err : new Error(String(err)) };
      }
    },
    getState() { return state; },
  };
}

module.exports = { createFetchState };`;
