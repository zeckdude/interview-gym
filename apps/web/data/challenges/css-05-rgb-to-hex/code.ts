export const starterTs = `function rgbToHex(r: number, g: number, b: number) {
  // Implement this function
  
}

export { rgbToHex };`;

export const starterJs = `function rgbToHex(r, g, b) {
  // Implement this function
  
}

module.exports = { rgbToHex };`;

export const solutionTs = `function rgbToHex(r: number, g: number, b: number) {
  const toHex = (n) => n.toString(16).padStart(2, '0');
    return '#' + toHex(r) + toHex(g) + toHex(b);
}

export { rgbToHex };`;

export const solutionJs = `function rgbToHex(r, g, b) {
  const toHex = (n) => n.toString(16).padStart(2, '0');
    return '#' + toHex(r) + toHex(g) + toHex(b);
}

module.exports = { rgbToHex };`;
