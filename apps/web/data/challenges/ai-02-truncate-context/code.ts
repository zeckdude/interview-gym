export const starterTs = `function truncateToTokens(text: string, maxTokens: number) {
  // Implement this function
  
}

export { truncateToTokens };`;

export const starterJs = `function truncateToTokens(text, maxTokens) {
  // Implement this function
  
}

module.exports = { truncateToTokens };`;

export const solutionTs = `function truncateToTokens(text: string, maxTokens: number) {
  const maxChars = maxTokens * 4;
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars);
}

export { truncateToTokens };`;

export const solutionJs = `function truncateToTokens(text, maxTokens) {
  const maxChars = maxTokens * 4;
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars);
}

module.exports = { truncateToTokens };`;
