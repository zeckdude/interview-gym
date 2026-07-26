export const starterTs = `function assertRejects(promise: Promise<unknown>) {
  // Implement this function
  
}

export { assertRejects };`;

export const starterJs = `function assertRejects(promise) {
  // Implement this function
  
}

module.exports = { assertRejects };`;

export const solutionTs = `function assertRejects(promise: Promise<unknown>) {
  try {
      await promise;
      return false;
    } catch {
      return true;
    }
}

export { assertRejects };`;

export const solutionJs = `function assertRejects(promise) {
  try {
      await promise;
      return false;
    } catch {
      return true;
    }
}

module.exports = { assertRejects };`;
