export const starterTs = `function sortByZIndex(items: Array<{ id: string; z: number }>) {
  // Implement this function
  
}

export { sortByZIndex };`;

export const starterJs = `function sortByZIndex(items) {
  // Implement this function
  
}

module.exports = { sortByZIndex };`;

export const solutionTs = `function sortByZIndex(items: Array<{ id: string; z: number }>) {
  return [...items].sort((a, b) => a.z - b.z);
}

export { sortByZIndex };`;

export const solutionJs = `function sortByZIndex(items) {
  return [...items].sort((a, b) => a.z - b.z);
}

module.exports = { sortByZIndex };`;
