export const starterTs = `function extractUrls(text: string) {
  // Implement this function
  
}

export { extractUrls };`;

export const starterJs = `function extractUrls(text) {
  // Implement this function
  
}

module.exports = { extractUrls };`;

export const solutionTs = `function extractUrls(text: string) {
  return text.match(/https?:\\/\\/\\S+/g) ?? [];
}

export { extractUrls };`;

export const solutionJs = `function extractUrls(text) {
  return text.match(/https?:\\/\\/\\S+/g) ?? [];
}

module.exports = { extractUrls };`;
