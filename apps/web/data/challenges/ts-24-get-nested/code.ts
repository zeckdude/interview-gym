export const starterTs = `function getNested(obj: Record<string, unknown>, path: string) {
  // Implement this function
  
}

export { getNested };`;

export const starterJs = `function getNested(obj, path) {
  // Implement this function
  
}

module.exports = { getNested };`;

export const solutionTs = `function getNested(obj: Record<string, unknown>, path: string) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

export { getNested };`;

export const solutionJs = `function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

module.exports = { getNested };`;
