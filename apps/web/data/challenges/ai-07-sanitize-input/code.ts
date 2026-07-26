export const starterTs = `function sanitizePrompt(input: string) {
  // Implement this function
  
}

export { sanitizePrompt };`;

export const starterJs = `function sanitizePrompt(input) {
  // Implement this function
  
}

module.exports = { sanitizePrompt };`;

export const solutionTs = `function sanitizePrompt(input: string) {
  return input.replace(/\\s+/g, ' ').trim().slice(0, 4000);
}

export { sanitizePrompt };`;

export const solutionJs = `function sanitizePrompt(input) {
  return input.replace(/\\s+/g, ' ').trim().slice(0, 4000);
}

module.exports = { sanitizePrompt };`;
