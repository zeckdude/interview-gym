export const starterTs = `function flagUnverifiedClaims(answer: string, sources: string[]) {
  // Implement this function
  
}

export { flagUnverifiedClaims };`;

export const starterJs = `function flagUnverifiedClaims(answer, sources) {
  // Implement this function
  
}

module.exports = { flagUnverifiedClaims };`;

export const solutionTs = `function flagUnverifiedClaims(answer: string, sources: string[]) {
  const answerWords = answer.toLowerCase().split(/\\s+/);
    return answerWords.filter((word) => word.length > 5 && !sources.join(' ').toLowerCase().includes(word));
}

export { flagUnverifiedClaims };`;

export const solutionJs = `function flagUnverifiedClaims(answer, sources) {
  const answerWords = answer.toLowerCase().split(/\\s+/);
    return answerWords.filter((word) => word.length > 5 && !sources.join(' ').toLowerCase().includes(word));
}

module.exports = { flagUnverifiedClaims };`;
