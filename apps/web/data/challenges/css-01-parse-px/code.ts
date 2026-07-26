export const starterTs = `function parsePx(value: string) {
  // Implement this function
  
}

export { parsePx };`;

export const starterJs = `function parsePx(value) {
  // Implement this function
  
}

module.exports = { parsePx };`;

export const solutionTs = `function parsePx(value: string) {
  const match = String(value).trim().match(/^(\\d+(?:\\.\\d+)?)px\$/);
    return match ? Number(match[1]) : null;
}

export { parsePx };`;

export const solutionJs = `function parsePx(value) {
  const match = String(value).trim().match(/^(\\d+(?:\\.\\d+)?)px\$/);
    return match ? Number(match[1]) : null;
}

module.exports = { parsePx };`;
