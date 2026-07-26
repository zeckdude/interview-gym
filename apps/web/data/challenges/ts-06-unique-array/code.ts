export const starterTs = `function unique(arr: unknown[]) {
  // Implement this function
  
}

export { unique };`;

export const starterJs = `function unique(arr) {
  // Implement this function
  
}

module.exports = { unique };`;

export const solutionTs = `function unique(arr: unknown[]) {
  return [...new Set(arr)];
}

export { unique };`;

export const solutionJs = `function unique(arr) {
  return [...new Set(arr)];
}

module.exports = { unique };`;
