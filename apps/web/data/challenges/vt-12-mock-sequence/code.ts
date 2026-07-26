export const starterTs = `function mockSequence(values) {
  // Implement this function
  
}

export { mockSequence };`;

export const starterJs = `function mockSequence(values) {
  // Implement this function
  
}

module.exports = { mockSequence };`;

export const solutionTs = `function mockSequence(values) {
  let i = 0;
    return () => values[i++];
}

export { mockSequence };`;

export const solutionJs = `function mockSequence(values) {
  let i = 0;
    return () => values[i++];
}

module.exports = { mockSequence };`;
