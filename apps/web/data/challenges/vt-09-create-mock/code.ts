export const starterTs = `function createMock() {
  // Implement this function
  
}

export { createMock };`;

export const starterJs = `function createMock() {
  // Implement this function
  
}

module.exports = { createMock };`;

export const solutionTs = `function createMock() {
  const calls = [];
    const mock = (...args) => { calls.push(args); return undefined; };
    mock.calls = calls;
    return mock;
}

export { createMock };`;

export const solutionJs = `function createMock() {
  const calls = [];
    const mock = (...args) => { calls.push(args); return undefined; };
    mock.calls = calls;
    return mock;
}

module.exports = { createMock };`;
