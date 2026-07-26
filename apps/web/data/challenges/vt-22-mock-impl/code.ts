export const starterTs = `function mockWithImpl(impl) {
  // Implement this function
  
}

export { mockWithImpl };`;

export const starterJs = `function mockWithImpl(impl) {
  // Implement this function
  
}

module.exports = { mockWithImpl };`;

export const solutionTs = `function mockWithImpl(impl) {
  const calls = [];
    const mock = (...args) => { calls.push(args); return impl(...args); };
    mock.calls = calls;
    return mock;
}

export { mockWithImpl };`;

export const solutionJs = `function mockWithImpl(impl) {
  const calls = [];
    const mock = (...args) => { calls.push(args); return impl(...args); };
    mock.calls = calls;
    return mock;
}

module.exports = { mockWithImpl };`;
