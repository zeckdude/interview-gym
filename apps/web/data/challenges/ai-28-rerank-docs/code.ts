export const starterTs = `function rerankDocs(query: string, docs: string[], score: (q: string, d: string) => number) {
  // Implement this function
  
}

export { rerankDocs };`;

export const starterJs = `function rerankDocs(query, docs, score) {
  // Implement this function
  
}

module.exports = { rerankDocs };`;

export const solutionTs = `function rerankDocs(query: string, docs: string[], score: (q: string, d: string) => number) {
  return [...docs].sort((a, b) => score(query, b) - score(query, a));
}

export { rerankDocs };`;

export const solutionJs = `function rerankDocs(query, docs, score) {
  return [...docs].sort((a, b) => score(query, b) - score(query, a));
}

module.exports = { rerankDocs };`;
