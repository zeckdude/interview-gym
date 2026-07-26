export const starterTs = `function hexToRgb(hex: string) {
  // Implement this function
  
}

export { hexToRgb };`;

export const starterJs = `function hexToRgb(hex) {
  // Implement this function
  
}

module.exports = { hexToRgb };`;

export const solutionTs = `function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
    const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
    return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16) };
}

export { hexToRgb };`;

export const solutionJs = `function hexToRgb(hex) {
  const clean = hex.replace('#', '');
    const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
    return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16) };
}

module.exports = { hexToRgb };`;
