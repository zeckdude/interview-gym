export const starterTs = `function createBatchScheduler(onFlush: (batch: number[]) => void, delayMs: number) {
  // Implement this function
  
}

export { createBatchScheduler };`;

export const starterJs = `function createBatchScheduler(onFlush, delayMs) {
  // Implement this function
  
}

module.exports = { createBatchScheduler };`;

export const solutionTs = `function createBatchScheduler(onFlush: (batch: number[]) => void, delayMs: number) {
  let queue = [];
    let scheduled = false;
    const flush = () => {
      scheduled = false;
      const batch = queue;
      queue = [];
      onFlush(batch);
    };
    return {
      push(item) {
        queue.push(item);
        if (!scheduled) {
          scheduled = true;
          setTimeout(flush, delayMs);
        }
      },
      size() { return queue.length; },
    };
}

export { createBatchScheduler };`;

export const solutionJs = `function createBatchScheduler(onFlush, delayMs) {
  let queue = [];
    let scheduled = false;
    const flush = () => {
      scheduled = false;
      const batch = queue;
      queue = [];
      onFlush(batch);
    };
    return {
      push(item) {
        queue.push(item);
        if (!scheduled) {
          scheduled = true;
          setTimeout(flush, delayMs);
        }
      },
      size() { return queue.length; },
    };
}

module.exports = { createBatchScheduler };`;
