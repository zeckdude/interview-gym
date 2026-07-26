export const starterTs = `function partition(arr: number[], pred: (n: number) => boolean) {
  // Implement this function
  
}

export { partition };`;

export const starterJs = `function partition(arr, pred) {
  // Implement this function
  
}

module.exports = { partition };`;

export const solutionTs = `function partition(arr: number[], pred: (n: number) => boolean) {
  const pass = [];
    const fail = [];
    for (const item of arr) {
      (pred(item) ? pass : fail).push(item);
    }
    return [pass, fail];
}

export { partition };`;

export const solutionJs = `function partition(arr, pred) {
  const pass = [];
    const fail = [];
    for (const item of arr) {
      (pred(item) ? pass : fail).push(item);
    }
    return [pass, fail];
}

module.exports = { partition };`;
