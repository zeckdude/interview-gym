export const starterTs = `function normalizeColor(value: string) {
  // Implement this function
  
}

export { normalizeColor };`;

export const starterJs = `function normalizeColor(value) {
  // Implement this function
  
}

module.exports = { normalizeColor };`;

export const solutionTs = `function normalizeColor(value: string) {
  const map = { black: '#000000', white: '#ffffff' };
    return map[value.toLowerCase()] ?? value;
}

export { normalizeColor };`;

export const solutionJs = `function normalizeColor(value) {
  const map = { black: '#000000', white: '#ffffff' };
    return map[value.toLowerCase()] ?? value;
}

module.exports = { normalizeColor };`;
