export const starterTs = `function groupBy(arr: unknown[], keyFn: (item: unknown) => string | number) {
  // Implement this function
  
}

export { groupBy };`;

export const starterJs = `function groupBy(arr, keyFn) {
  // Implement this function
  
}

module.exports = { groupBy };`;

export const solutionTs = `function groupBy(arr: unknown[], keyFn: (item: unknown) => string | number) {
  return arr.reduce((acc, item) => {
      const key = String(keyFn(item));
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
}

export { groupBy };`;

export const solutionJs = `function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
      const key = String(keyFn(item));
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
}

module.exports = { groupBy };`;
