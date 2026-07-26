export const starterTs = `function parseMinmax(value: string) {
  // Implement this function
  
}

export { parseMinmax };`;

export const starterJs = `function parseMinmax(value) {
  // Implement this function
  
}

module.exports = { parseMinmax };`;

export const solutionTs = `function parseMinmax(value: string) {
  const match = value.match(/minmax\\(([^,]+),\\s*([^)]+)\\)/);
    if (!match) return null;
    return { min: match[1].trim(), max: match[2].trim() };
}

export { parseMinmax };`;

export const solutionJs = `function parseMinmax(value) {
  const match = value.match(/minmax\\(([^,]+),\\s*([^)]+)\\)/);
    if (!match) return null;
    return { min: match[1].trim(), max: match[2].trim() };
}

module.exports = { parseMinmax };`;
