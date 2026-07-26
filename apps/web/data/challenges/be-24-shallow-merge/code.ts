export const starterTs = `function shallowMerge(a: Record<string, unknown>, b: Record<string, unknown>) {
  // Implement this function
  
}

export { shallowMerge };`;

export const starterJs = `function shallowMerge(a, b) {
  // Implement this function
  
}

module.exports = { shallowMerge };`;

export const solutionTs = `function shallowMerge(a: Record<string, unknown>, b: Record<string, unknown>) {
  return { ...a, ...b };
}

export { shallowMerge };`;

export const solutionJs = `function shallowMerge(a, b) {
  return { ...a, ...b };
}

module.exports = { shallowMerge };`;
