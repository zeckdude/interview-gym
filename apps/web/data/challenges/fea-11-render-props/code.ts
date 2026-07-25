export const starterTs = `interface RenderState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function createDataProvider<T>(fetchFn: typeof fetch) {
  // Implement render props pattern

  return {
    render<R>(_renderProp: (state: RenderState<T>) => R): R | null {
      return null;
    },
    async execute(_url: string): Promise<void> {},
  };
}

export { createDataProvider };`;

export const starterJs = `function createDataProvider(fetchFn) {
  // Implement render props pattern

  return {
    render(renderProp) {
      return null;
    },
    async execute(url) {},
  };
}

module.exports = { createDataProvider };`;

export const solutionTs = `interface RenderState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function createDataProvider<T>(fetchFn: typeof fetch) {
  let state: RenderState<T> = { data: null, loading: false, error: null };
  let currentRenderProp: ((s: RenderState<T>) => unknown) | null = null;

  return {
    render<R>(renderProp: (state: RenderState<T>) => R): R {
      currentRenderProp = renderProp as (s: RenderState<T>) => unknown;
      return renderProp(state);
    },
    async execute(url: string): Promise<void> {
      state = { data: null, loading: true, error: null };
      currentRenderProp?.(state);
      try {
        const res = await fetchFn(url);
        const data = await res.json() as T;
        state = { data, loading: false, error: null };
      } catch (err) {
        state = { data: null, loading: false, error: err instanceof Error ? err : new Error(String(err)) };
      }
      currentRenderProp?.(state);
    },
  };
}

export { createDataProvider };`;

export const solutionJs = `function createDataProvider(fetchFn) {
  let state = { data: null, loading: false, error: null };
  let currentRenderProp = null;

  return {
    render(renderProp) {
      currentRenderProp = renderProp;
      return renderProp(state);
    },
    async execute(url) {
      state = { data: null, loading: true, error: null };
      currentRenderProp?.(state);
      try {
        const res = await fetchFn(url);
        const data = await res.json();
        state = { data, loading: false, error: null };
      } catch (err) {
        state = { data: null, loading: false, error: err instanceof Error ? err : new Error(String(err)) };
      }
      currentRenderProp?.(state);
    },
  };
}

module.exports = { createDataProvider };`;
