export const starterTs = `function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  // Group items by key function
  return {};
}

export { groupBy };`;

export const starterJs = `function groupBy(arr, keyFn) {
  // Group items by key function
  return {};
}

module.exports = { groupBy };`;

export const solutionTs = `function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
}

export { groupBy };`;

export const solutionJs = `function groupBy(arr, keyFn) {
  return arr.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
}

module.exports = { groupBy };`;
