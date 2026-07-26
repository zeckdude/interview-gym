export const starterTs = `function partition(arr: number[], predicate: (n: number) => boolean) {
  // Implement this function
  
}

export { partition };`;

export const starterJs = `function partition(arr, predicate) {
  // Implement this function
  
}

module.exports = { partition };`;

export const solutionTs = `function partition(arr: number[], predicate: (n: number) => boolean) {
  const pass = [];
    const fail = [];
    for (const item of arr) {
      if (predicate(item)) pass.push(item);
      else fail.push(item);
    }
    return [pass, fail];
}

export { partition };`;

export const solutionJs = `function partition(arr, predicate) {
  const pass = [];
    const fail = [];
    for (const item of arr) {
      if (predicate(item)) pass.push(item);
      else fail.push(item);
    }
    return [pass, fail];
}

module.exports = { partition };`;
