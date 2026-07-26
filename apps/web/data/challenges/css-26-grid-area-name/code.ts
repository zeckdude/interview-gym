export const starterTs = `function parseGridArea(area: string) {
  // Implement this function
  
}

export { parseGridArea };`;

export const starterJs = `function parseGridArea(area) {
  // Implement this function
  
}

module.exports = { parseGridArea };`;

export const solutionTs = `function parseGridArea(area: string) {
  const parts = area.split('/');
    return { rowStart: parts[0].trim(), colStart: parts[1]?.trim() ?? parts[0].trim() };
}

export { parseGridArea };`;

export const solutionJs = `function parseGridArea(area) {
  const parts = area.split('/');
    return { rowStart: parts[0].trim(), colStart: parts[1]?.trim() ?? parts[0].trim() };
}

module.exports = { parseGridArea };`;
