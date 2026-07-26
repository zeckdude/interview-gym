export const starterTs = `function relevanceScore(doc: string, keywords: string[]) {
  // Implement this function
  
}

export { relevanceScore };`;

export const starterJs = `function relevanceScore(doc, keywords) {
  // Implement this function
  
}

module.exports = { relevanceScore };`;

export const solutionTs = `function relevanceScore(doc: string, keywords: string[]) {
  return keywords.filter((k) => doc.includes(k)).length;
}

export { relevanceScore };`;

export const solutionJs = `function relevanceScore(doc, keywords) {
  return keywords.filter((k) => doc.includes(k)).length;
}

module.exports = { relevanceScore };`;
