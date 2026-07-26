export const starterTs = `function capitalizeWord(str: string) {
  // Implement this function
  
}

export { capitalizeWord };`;

export const starterJs = `function capitalizeWord(str) {
  // Implement this function
  
}

module.exports = { capitalizeWord };`;

export const solutionTs = `function capitalizeWord(str: string) {
  if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export { capitalizeWord };`;

export const solutionJs = `function capitalizeWord(str) {
  if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = { capitalizeWord };`;
