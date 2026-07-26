export const starterTs = `function estimateTokens(text: string) {
  // Implement this function
  
}

export { estimateTokens };`;

export const starterJs = `function estimateTokens(text) {
  // Implement this function
  
}

module.exports = { estimateTokens };`;

export const solutionTs = `function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}

export { estimateTokens };`;

export const solutionJs = `function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

module.exports = { estimateTokens };`;
