export const starterTs = `function capitalize(str: string) {
  // Implement this function
  
}

export { capitalize };`;

export const starterJs = `function capitalize(str) {
  // Implement this function
  
}

module.exports = { capitalize };`;

export const solutionTs = `function capitalize(str: string) {
  if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export { capitalize };`;

export const solutionJs = `function capitalize(str) {
  if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = { capitalize };`;
