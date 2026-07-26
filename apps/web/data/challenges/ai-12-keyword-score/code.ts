export const starterTs = `function keywordScore(query: string, text: string) {
  // Implement this function
  
}

export { keywordScore };`;

export const starterJs = `function keywordScore(query, text) {
  // Implement this function
  
}

module.exports = { keywordScore };`;

export const solutionTs = `function keywordScore(query: string, text: string) {
  const words = query.toLowerCase().split(/\\s+/);
    const lower = text.toLowerCase();
    return words.filter((w) => lower.includes(w)).length;
}

export { keywordScore };`;

export const solutionJs = `function keywordScore(query, text) {
  const words = query.toLowerCase().split(/\\s+/);
    const lower = text.toLowerCase();
    return words.filter((w) => lower.includes(w)).length;
}

module.exports = { keywordScore };`;
