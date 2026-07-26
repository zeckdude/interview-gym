export const starterTs = `function matchesMinWidth(viewport: number, minWidth: number) {
  // Implement this function
  
}

export { matchesMinWidth };`;

export const starterJs = `function matchesMinWidth(viewport, minWidth) {
  // Implement this function
  
}

module.exports = { matchesMinWidth };`;

export const solutionTs = `function matchesMinWidth(viewport: number, minWidth: number) {
  return viewport >= minWidth;
}

export { matchesMinWidth };`;

export const solutionJs = `function matchesMinWidth(viewport, minWidth) {
  return viewport >= minWidth;
}

module.exports = { matchesMinWidth };`;
