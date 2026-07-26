export const starterTs = `function runAsyncTests(tests: Array<() => Promise<boolean>>) {
  // Implement this function
  
}

export { runAsyncTests };`;

export const starterJs = `function runAsyncTests(tests) {
  // Implement this function
  
}

module.exports = { runAsyncTests };`;

export const solutionTs = `function runAsyncTests(tests: Array<() => Promise<boolean>>) {
  for (const test of tests) {
      const ok = await test();
      if (!ok) return false;
    }
    return true;
}

export { runAsyncTests };`;

export const solutionJs = `function runAsyncTests(tests) {
  for (const test of tests) {
      const ok = await test();
      if (!ok) return false;
    }
    return true;
}

module.exports = { runAsyncTests };`;
