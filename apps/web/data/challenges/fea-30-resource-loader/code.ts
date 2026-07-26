export const starterTs = `function createResourceLoader() {
  // Implement this function
  
}

export { createResourceLoader };`;

export const starterJs = `function createResourceLoader() {
  // Implement this function
  
}

module.exports = { createResourceLoader };`;

export const solutionTs = `function createResourceLoader() {
  const resources = new Map();
    return {
      async load(id, fetcher) {
        if (resources.has(id)) return resources.get(id);
        const promise = fetcher().then((data) => {
          resources.set(id, { status: 'success', data });
          return data;
        }).catch((error) => {
          resources.set(id, { status: 'error', error });
          throw error;
        });
        resources.set(id, { status: 'loading', promise });
        return promise;
      },
      getState(id) {
        return resources.get(id) ?? { status: 'idle' };
      },
    };
}

export { createResourceLoader };`;

export const solutionJs = `function createResourceLoader() {
  const resources = new Map();
    return {
      async load(id, fetcher) {
        if (resources.has(id)) return resources.get(id);
        const promise = fetcher().then((data) => {
          resources.set(id, { status: 'success', data });
          return data;
        }).catch((error) => {
          resources.set(id, { status: 'error', error });
          throw error;
        });
        resources.set(id, { status: 'loading', promise });
        return promise;
      },
      getState(id) {
        return resources.get(id) ?? { status: 'idle' };
      },
    };
}

module.exports = { createResourceLoader };`;
