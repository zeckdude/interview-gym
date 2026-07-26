export const starterTs = `function safeParseInt(value: string, fallback: number) {
  // Implement this function
  
}

export { safeParseInt };`;

export const starterJs = `function safeParseInt(value, fallback) {
  // Implement this function
  
}

module.exports = { safeParseInt };`;

export const solutionTs = `function safeParseInt(value: string, fallback: number) {
  const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
}

export { safeParseInt };`;

export const solutionJs = `function safeParseInt(value, fallback) {
  const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
}

module.exports = { safeParseInt };`;
