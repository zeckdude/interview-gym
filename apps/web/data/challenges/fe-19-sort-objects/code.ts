export const starterTs = `function sortBy<T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  // Return a new sorted array without mutating the original
  return arr;
}

export { sortBy };`;

export const starterJs = `function sortBy(arr, key, direction = 'asc') {
  // Return a new sorted array without mutating the original
  return arr;
}

module.exports = { sortBy };`;

export const solutionTs = `function sortBy<T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  const multiplier = direction === 'desc' ? -1 : 1;
  return [...arr].sort((a, b) => {
    const va = a[key];
    const vb = b[key];
    if (va < vb) return -1 * multiplier;
    if (va > vb) return 1 * multiplier;
    return 0;
  });
}

export { sortBy };`;

export const solutionJs = `function sortBy(arr, key, direction = 'asc') {
  const multiplier = direction === 'desc' ? -1 : 1;
  return [...arr].sort((a, b) => {
    const va = a[key];
    const vb = b[key];
    if (va < vb) return -1 * multiplier;
    if (va > vb) return 1 * multiplier;
    return 0;
  });
}

module.exports = { sortBy };`;
