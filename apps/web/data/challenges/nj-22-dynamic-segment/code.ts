export const starterTs = `function isDynamicSegment(segment: string) {
  // Implement this function
  
}

export { isDynamicSegment };`;

export const starterJs = `function isDynamicSegment(segment) {
  // Implement this function
  
}

module.exports = { isDynamicSegment };`;

export const solutionTs = `function isDynamicSegment(segment: string) {
  return segment.startsWith('[') && segment.endsWith(']');
}

export { isDynamicSegment };`;

export const solutionJs = `function isDynamicSegment(segment) {
  return segment.startsWith('[') && segment.endsWith(']');
}

module.exports = { isDynamicSegment };`;
