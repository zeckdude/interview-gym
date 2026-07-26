export const starterTs = `function assertCallOrder(mock: { calls: unknown[][] }, order: string[]) {
  // Implement this function
  
}

export { assertCallOrder };`;

export const starterJs = `function assertCallOrder(mock, order) {
  // Implement this function
  
}

module.exports = { assertCallOrder };`;

export const solutionTs = `function assertCallOrder(mock: { calls: unknown[][] }, order: string[]) {
  return JSON.stringify(mock.calls.map((c) => c[0])) === JSON.stringify(order);
}

export { assertCallOrder };`;

export const solutionJs = `function assertCallOrder(mock, order) {
  return JSON.stringify(mock.calls.map((c) => c[0])) === JSON.stringify(order);
}

module.exports = { assertCallOrder };`;
