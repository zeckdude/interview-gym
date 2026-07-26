export const starterTs = `function cosineSimilarity(a: number[], b: number[]) {
  // Implement this function
  
}

export { cosineSimilarity };`;

export const starterJs = `function cosineSimilarity(a, b) {
  // Implement this function
  
}

module.exports = { cosineSimilarity };`;

export const solutionTs = `function cosineSimilarity(a: number[], b: number[]) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
    const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
    const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
    return dot / (magA * magB);
}

export { cosineSimilarity };`;

export const solutionJs = `function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
    const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
    const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
    return dot / (magA * magB);
}

module.exports = { cosineSimilarity };`;
