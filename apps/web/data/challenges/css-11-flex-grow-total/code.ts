export const starterTs = `function flexGrowTotal(items: Array<{ grow: number }>) {
  // Implement this function
  
}

export { flexGrowTotal };`;

export const starterJs = `function flexGrowTotal(items) {
  // Implement this function
  
}

module.exports = { flexGrowTotal };`;

export const solutionTs = `function flexGrowTotal(items: Array<{ grow: number }>) {
  return items.reduce((sum, item) => sum + item.grow, 0);
}

export { flexGrowTotal };`;

export const solutionJs = `function flexGrowTotal(items) {
  return items.reduce((sum, item) => sum + item.grow, 0);
}

module.exports = { flexGrowTotal };`;
