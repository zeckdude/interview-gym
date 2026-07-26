export const starterTs = `function pxToRem(px: number, base = 16) {
  // Implement this function
  
}

export { pxToRem };`;

export const starterJs = `function pxToRem(px, base = 16) {
  // Implement this function
  
}

module.exports = { pxToRem };`;

export const solutionTs = `function pxToRem(px: number, base = 16) {
  return px / base;
}

export { pxToRem };`;

export const solutionJs = `function pxToRem(px, base = 16) {
  return px / base;
}

module.exports = { pxToRem };`;
