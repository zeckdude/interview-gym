export const starterTs = `function assertArrayContaining(arr: unknown[], subset: unknown[]) {
  // Implement this function
  
}

export { assertArrayContaining };`;

export const starterJs = `function assertArrayContaining(arr, subset) {
  // Implement this function
  
}

module.exports = { assertArrayContaining };`;

export const solutionTs = `function assertArrayContaining(arr: unknown[], subset: unknown[]) {
  return subset.every((item) => arr.includes(item));
}

export { assertArrayContaining };`;

export const solutionJs = `function assertArrayContaining(arr, subset) {
  return subset.every((item) => arr.includes(item));
}

module.exports = { assertArrayContaining };`;
