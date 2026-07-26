export const starterTs = `function chunk(arr: unknown[], size: number) {
  // Implement this function
  
}

export { chunk };`;

export const starterJs = `function chunk(arr, size) {
  // Implement this function
  
}

module.exports = { chunk };`;

export const solutionTs = `function chunk(arr: unknown[], size: number) {
  const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
}

export { chunk };`;

export const solutionJs = `function chunk(arr, size) {
  const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
}

module.exports = { chunk };`;
