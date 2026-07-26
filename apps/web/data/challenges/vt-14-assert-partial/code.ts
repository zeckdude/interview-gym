export const starterTs = `function assertPartial(actual: Record<string, unknown>, expected: Record<string, unknown>) {
  // Implement this function
  
}

export { assertPartial };`;

export const starterJs = `function assertPartial(actual, expected) {
  // Implement this function
  
}

module.exports = { assertPartial };`;

export const solutionTs = `function assertPartial(actual: Record<string, unknown>, expected: Record<string, unknown>) {
  for (const key of Object.keys(expected)) {
      if (actual[key] !== expected[key]) throw new Error('Mismatch at ' + key);
    }
}

export { assertPartial };`;

export const solutionJs = `function assertPartial(actual, expected) {
  for (const key of Object.keys(expected)) {
      if (actual[key] !== expected[key]) throw new Error('Mismatch at ' + key);
    }
}

module.exports = { assertPartial };`;
