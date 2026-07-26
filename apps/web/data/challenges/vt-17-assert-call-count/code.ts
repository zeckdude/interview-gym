export const starterTs = `function assertCallCount(mock: { calls: unknown[][] }, count: number) {
  // Implement this function
  
}

export { assertCallCount };`;

export const starterJs = `function assertCallCount(mock, count) {
  // Implement this function
  
}

module.exports = { assertCallCount };`;

export const solutionTs = `function assertCallCount(mock: { calls: unknown[][] }, count: number) {
  if (mock.calls.length !== count) throw new Error('Expected ' + count + ' calls');
}

export { assertCallCount };`;

export const solutionJs = `function assertCallCount(mock, count) {
  if (mock.calls.length !== count) throw new Error('Expected ' + count + ' calls');
}

module.exports = { assertCallCount };`;
