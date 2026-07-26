export const starterTs = `function flattenToDepth(arr: unknown[], depth: number) {
  // Implement this function
  
}

export { flattenToDepth };`;

export const starterJs = `function flattenToDepth(arr, depth) {
  // Implement this function
  
}

module.exports = { flattenToDepth };`;

export const solutionTs = `function flattenToDepth(arr: unknown[], depth: number) {
  return arr.reduce((acc, item) => {
      if (Array.isArray(item) && depth > 0) {
        acc.push(...flattenToDepth(item, depth - 1));
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
}

export { flattenToDepth };`;

export const solutionJs = `function flattenToDepth(arr, depth) {
  return arr.reduce((acc, item) => {
      if (Array.isArray(item) && depth > 0) {
        acc.push(...flattenToDepth(item, depth - 1));
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
}

module.exports = { flattenToDepth };`;
