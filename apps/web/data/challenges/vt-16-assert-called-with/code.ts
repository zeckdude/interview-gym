export const starterTs = `function assertCalledWith(mock: { calls: unknown[][] }, args: unknown[]) {
  // Implement this function
  
}

export { assertCalledWith };`;

export const starterJs = `function assertCalledWith(mock, args) {
  // Implement this function
  
}

module.exports = { assertCalledWith };`;

export const solutionTs = `function assertCalledWith(mock: { calls: unknown[][] }, args: unknown[]) {
  const last = mock.calls[mock.calls.length - 1];
    if (!last || JSON.stringify(last) !== JSON.stringify(args)) throw new Error('Call args mismatch');
}

export { assertCalledWith };`;

export const solutionJs = `function assertCalledWith(mock, args) {
  const last = mock.calls[mock.calls.length - 1];
    if (!last || JSON.stringify(last) !== JSON.stringify(args)) throw new Error('Call args mismatch');
}

module.exports = { assertCalledWith };`;
