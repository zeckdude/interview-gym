export const starterTs = `function flattenOnce(arr: unknown[][]) {
  // Implement this function
  
}

export { flattenOnce };`;

export const starterJs = `function flattenOnce(arr) {
  // Implement this function
  
}

module.exports = { flattenOnce };`;

export const solutionTs = `function flattenOnce(arr: unknown[][]) {
  return arr.reduce((acc, item) => acc.concat(item), []);
}

export { flattenOnce };`;

export const solutionJs = `function flattenOnce(arr) {
  return arr.reduce((acc, item) => acc.concat(item), []);
}

module.exports = { flattenOnce };`;
