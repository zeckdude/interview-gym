export const starterTs = `interface VirtualListOptions<T> {
  items: T[];
  itemHeight: number;
  viewportHeight: number;
  scrollTop: number;
}

interface VirtualListResult<T> {
  startIndex: number;
  endIndex: number;
  visibleItems: T[];
  offsetY: number;
}

function getVisibleItems<T>(options: VirtualListOptions<T>): VirtualListResult<T> {
  const { items, itemHeight, viewportHeight, scrollTop } = options;

  // Calculate which items should be rendered
  
  return {
    startIndex: 0,
    endIndex: items.length,
    visibleItems: items,
    offsetY: 0,
  };
}

export { getVisibleItems };`;

export const starterJs = `function getVisibleItems({ items, itemHeight, viewportHeight, scrollTop }) {
  // Calculate which items should be rendered

  return {
    startIndex: 0,
    endIndex: items.length,
    visibleItems: items,
    offsetY: 0,
  };
}

module.exports = { getVisibleItems };`;

export const solutionTs = `interface VirtualListOptions<T> {
  items: T[];
  itemHeight: number;
  viewportHeight: number;
  scrollTop: number;
}

interface VirtualListResult<T> {
  startIndex: number;
  endIndex: number;
  visibleItems: T[];
  offsetY: number;
}

function getVisibleItems<T>(options: VirtualListOptions<T>): VirtualListResult<T> {
  const { items, itemHeight, viewportHeight, scrollTop } = options;
  const BUFFER = 1;

  const firstVisible = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(viewportHeight / itemHeight);

  const startIndex = Math.max(0, firstVisible - BUFFER);
  const endIndex = Math.min(items.length, firstVisible + visibleCount + BUFFER);

  return {
    startIndex,
    endIndex,
    visibleItems: items.slice(startIndex, endIndex),
    offsetY: startIndex * itemHeight,
  };
}

export { getVisibleItems };`;

export const solutionJs = `function getVisibleItems({ items, itemHeight, viewportHeight, scrollTop }) {
  const BUFFER = 1;

  const firstVisible = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(viewportHeight / itemHeight);

  const startIndex = Math.max(0, firstVisible - BUFFER);
  const endIndex = Math.min(items.length, firstVisible + visibleCount + BUFFER);

  return {
    startIndex,
    endIndex,
    visibleItems: items.slice(startIndex, endIndex),
    offsetY: startIndex * itemHeight,
  };
}

module.exports = { getVisibleItems };`;
