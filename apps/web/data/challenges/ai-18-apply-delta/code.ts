export const starterTs = `function applyStreamDelta(previous: string, delta: string) {
  // Implement this function
  
}

export { applyStreamDelta };`;

export const starterJs = `function applyStreamDelta(previous, delta) {
  // Implement this function
  
}

module.exports = { applyStreamDelta };`;

export const solutionTs = `function applyStreamDelta(previous: string, delta: string) {
  return previous + delta;
}

export { applyStreamDelta };`;

export const solutionJs = `function applyStreamDelta(previous, delta) {
  return previous + delta;
}

module.exports = { applyStreamDelta };`;
