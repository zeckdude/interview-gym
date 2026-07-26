export const starterTs = `function runTestCases(cases: Array<{ input: number; expected: number }>, fn: (n: number) => number) {
  // Implement this function
  
}

export { runTestCases };`;

export const starterJs = `function runTestCases(cases, fn) {
  // Implement this function
  
}

module.exports = { runTestCases };`;

export const solutionTs = `function runTestCases(cases: Array<{ input: number; expected: number }>, fn: (n: number) => number) {
  return cases.every((c) => fn(c.input) === c.expected);
}

export { runTestCases };`;

export const solutionJs = `function runTestCases(cases, fn) {
  return cases.every((c) => fn(c.input) === c.expected);
}

module.exports = { runTestCases };`;
