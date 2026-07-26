export const starterTs = `function truncate(text: string, max: number) {
  // Implement this function
  
}

export { truncate };`;

export const starterJs = `function truncate(text, max) {
  // Implement this function
  
}

module.exports = { truncate };`;

export const solutionTs = `function truncate(text: string, max: number) {
  if (text.length <= max) return text;
    return text.slice(0, Math.max(0, max - 1)) + '…';
}

export { truncate };`;

export const solutionJs = `function truncate(text, max) {
  if (text.length <= max) return text;
    return text.slice(0, Math.max(0, max - 1)) + '…';
}

module.exports = { truncate };`;
