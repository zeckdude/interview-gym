export const starterTs = `function lerp(start: number, end: number, t: number) {
  // Implement this function
  
}

export { lerp };`;

export const starterJs = `function lerp(start, end, t) {
  // Implement this function
  
}

module.exports = { lerp };`;

export const solutionTs = `function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

export { lerp };`;

export const solutionJs = `function lerp(start, end, t) {
  return start + (end - start) * t;
}

module.exports = { lerp };`;
