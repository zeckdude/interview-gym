export const starterTs = `function assertNoThrow(fn: () => void) {
  // Implement this function
  
}

export { assertNoThrow };`;

export const starterJs = `function assertNoThrow(fn) {
  // Implement this function
  
}

module.exports = { assertNoThrow };`;

export const solutionTs = `function assertNoThrow(fn: () => void) {
  try {
      fn();
      return true;
    } catch {
      return false;
    }
}

export { assertNoThrow };`;

export const solutionJs = `function assertNoThrow(fn) {
  try {
      fn();
      return true;
    } catch {
      return false;
    }
}

module.exports = { assertNoThrow };`;
