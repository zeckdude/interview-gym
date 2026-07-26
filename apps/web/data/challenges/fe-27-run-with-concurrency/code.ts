export const starterTs = `async function runWithConcurrency(tasks: Array<() => Promise<number>>, limit: number) {
  // Implement this function
  
}

export { runWithConcurrency };`;

export const starterJs = `async function runWithConcurrency(tasks, limit) {
  // Implement this function
  
}

module.exports = { runWithConcurrency };`;

export const solutionTs = `async function runWithConcurrency(tasks: Array<() => Promise<number>>, limit: number) {
  const results = new Array(tasks.length);
    let nextIndex = 0;
    async function worker() {
      while (nextIndex < tasks.length) {
        const i = nextIndex++;
        results[i] = await tasks[i]();
      }
    }
    const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
    await Promise.all(workers);
    return results;
}

export { runWithConcurrency };`;

export const solutionJs = `async function runWithConcurrency(tasks, limit) {
  const results = new Array(tasks.length);
    let nextIndex = 0;
    async function worker() {
      while (nextIndex < tasks.length) {
        const i = nextIndex++;
        results[i] = await tasks[i]();
      }
    }
    const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
    await Promise.all(workers);
    return results;
}

module.exports = { runWithConcurrency };`;
