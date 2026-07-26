export const starterTs = `function stableSortBy(arr: { name: string; score: number }[], keyFn: (item: { name: string; score: number }) => number) {
  // Implement this function
  
}

export { stableSortBy };`;

export const starterJs = `function stableSortBy(arr, keyFn) {
  // Implement this function
  
}

module.exports = { stableSortBy };`;

export const solutionTs = `function stableSortBy(arr: { name: string; score: number }[], keyFn: (item: { name: string; score: number }) => number) {
  return arr
      .map((item, index) => ({ item, index }))
      .sort((a, b) => {
        const cmp = keyFn(a.item) < keyFn(b.item) ? -1 : keyFn(a.item) > keyFn(b.item) ? 1 : 0;
        return cmp !== 0 ? cmp : a.index - b.index;
      })
      .map(({ item }) => item);
}

export { stableSortBy };`;

export const solutionJs = `function stableSortBy(arr, keyFn) {
  return arr
      .map((item, index) => ({ item, index }))
      .sort((a, b) => {
        const cmp = keyFn(a.item) < keyFn(b.item) ? -1 : keyFn(a.item) > keyFn(b.item) ? 1 : 0;
        return cmp !== 0 ? cmp : a.index - b.index;
      })
      .map(({ item }) => item);
}

module.exports = { stableSortBy };`;
