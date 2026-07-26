export const starterTs = `function fluidFontSize(min: number, max: number, minVw: number, maxVw: number, viewport: number) {
  // Implement this function
  
}

export { fluidFontSize };`;

export const starterJs = `function fluidFontSize(min, max, minVw, maxVw, viewport) {
  // Implement this function
  
}

module.exports = { fluidFontSize };`;

export const solutionTs = `function fluidFontSize(min: number, max: number, minVw: number, maxVw: number, viewport: number) {
  const ratio = (viewport - minVw) / (maxVw - minVw);
    const clamped = Math.min(1, Math.max(0, ratio));
    return min + (max - min) * clamped;
}

export { fluidFontSize };`;

export const solutionJs = `function fluidFontSize(min, max, minVw, maxVw, viewport) {
  const ratio = (viewport - minVw) / (maxVw - minVw);
    const clamped = Math.min(1, Math.max(0, ratio));
    return min + (max - min) * clamped;
}

module.exports = { fluidFontSize };`;
