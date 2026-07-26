export const starterTs = `function extractJson(text: string) {
  // Implement this function
  
}

export { extractJson };`;

export const starterJs = `function extractJson(text) {
  // Implement this function
  
}

module.exports = { extractJson };`;

export const solutionTs = `function extractJson(text: string) {
  const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    return JSON.parse(text.slice(start, end + 1));
}

export { extractJson };`;

export const solutionJs = `function extractJson(text) {
  const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    return JSON.parse(text.slice(start, end + 1));
}

module.exports = { extractJson };`;
