export const starterTs = `function gridColumnCount(template: string) {
  // Implement this function
  
}

export { gridColumnCount };`;

export const starterJs = `function gridColumnCount(template) {
  // Implement this function
  
}

module.exports = { gridColumnCount };`;

export const solutionTs = `function gridColumnCount(template: string) {
  return template.trim().split(/\\s+/).length;
}

export { gridColumnCount };`;

export const solutionJs = `function gridColumnCount(template) {
  return template.trim().split(/\\s+/).length;
}

module.exports = { gridColumnCount };`;
