export const starterTs = `function totalBoxSize(content: number, padding: number, border: number, margin: number) {
  // Implement this function
  
}

export { totalBoxSize };`;

export const starterJs = `function totalBoxSize(content, padding, border, margin) {
  // Implement this function
  
}

module.exports = { totalBoxSize };`;

export const solutionTs = `function totalBoxSize(content: number, padding: number, border: number, margin: number) {
  return content + padding * 2 + border * 2 + margin * 2;
}

export { totalBoxSize };`;

export const solutionJs = `function totalBoxSize(content, padding, border, margin) {
  return content + padding * 2 + border * 2 + margin * 2;
}

module.exports = { totalBoxSize };`;
