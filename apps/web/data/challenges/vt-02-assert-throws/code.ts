export const starterTs = `function assertThrows(fn: () => void) {
  // Implement this function
  
}

export { assertThrows };`;

export const starterJs = `function assertThrows(fn) {
  // Implement this function
  
}

module.exports = { assertThrows };`;

export const solutionTs = `function assertThrows(fn: () => void) {
  try {
      fn();
      throw new Error('Did not throw');
    } catch (e) {
      if (e instanceof Error && e.message === 'Did not throw') throw e;
      return true;
    }
}

export { assertThrows };`;

export const solutionJs = `function assertThrows(fn) {
  try {
      fn();
      throw new Error('Did not throw');
    } catch (e) {
      if (e instanceof Error && e.message === 'Did not throw') throw e;
      return true;
    }
}

module.exports = { assertThrows };`;
