export const starterTs = `interface InfiniteScrollOptions {
  sentinel: Element;
  onLoadMore: () => Promise<void>;
  threshold?: number;
}

function createInfiniteScroller(options: InfiniteScrollOptions) {
  const { sentinel, onLoadMore, threshold = 0.1 } = options;

  // Set up IntersectionObserver here

  return {
    destroy() {},
  };
}

export { createInfiniteScroller };`;

export const starterJs = `function createInfiniteScroller({ sentinel, onLoadMore, threshold = 0.1 }) {
  // Set up IntersectionObserver here

  return {
    destroy() {},
  };
}

module.exports = { createInfiniteScroller };`;

export const solutionTs = `interface InfiniteScrollOptions {
  sentinel: Element;
  onLoadMore: () => Promise<void>;
  threshold?: number;
}

function createInfiniteScroller(options: InfiniteScrollOptions) {
  const { sentinel, onLoadMore, threshold = 0.1 } = options;
  let loading = false;

  const observer = new IntersectionObserver(async (entries) => {
    const entry = entries[0];
    if (!entry.isIntersecting || loading) return;
    loading = true;
    try {
      await onLoadMore();
    } finally {
      loading = false;
    }
  }, { threshold });

  observer.observe(sentinel);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}

export { createInfiniteScroller };`;

export const solutionJs = `function createInfiniteScroller({ sentinel, onLoadMore, threshold = 0.1 }) {
  let loading = false;

  const observer = new IntersectionObserver(async (entries) => {
    const entry = entries[0];
    if (!entry.isIntersecting || loading) return;
    loading = true;
    try {
      await onLoadMore();
    } finally {
      loading = false;
    }
  }, { threshold });

  observer.observe(sentinel);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}

module.exports = { createInfiniteScroller };`;
