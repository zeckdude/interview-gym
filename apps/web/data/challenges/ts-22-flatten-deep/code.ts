export const starterTs = `function flattenDeep(arr: unknown[]) {
  // Implement this function
  
}

export { flattenDeep };`;

export const starterJs = `function flattenDeep(arr) {
  // Implement this function
  
}

module.exports = { flattenDeep };`;

export const solutionTs = `function flattenDeep(arr: unknown[]) {
  return arr.reduce((acc, item) => acc.concat(Array.isArray(item) ? flattenDeep(item) : item), []);
}

export { flattenDeep };`;

export const solutionJs = `function flattenDeep(arr) {
  return arr.reduce((acc, item) => acc.concat(Array.isArray(item) ? flattenDeep(item) : item), []);
}

module.exports = { flattenDeep };`;
