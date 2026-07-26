export const starterTs = `function arrayToRecord(arr: Array<Record<string, unknown>>, keyFn: (item: Record<string, unknown>) => string) {
  // Implement this function
  
}

export { arrayToRecord };`;

export const starterJs = `function arrayToRecord(arr, keyFn) {
  // Implement this function
  
}

module.exports = { arrayToRecord };`;

export const solutionTs = `function arrayToRecord(arr: Array<Record<string, unknown>>, keyFn: (item: Record<string, unknown>) => string) {
  return arr.reduce((acc, item) => {
      acc[String(keyFn(item))] = item;
      return acc;
    }, {});
}

export { arrayToRecord };`;

export const solutionJs = `function arrayToRecord(arr, keyFn) {
  return arr.reduce((acc, item) => {
      acc[String(keyFn(item))] = item;
      return acc;
    }, {});
}

module.exports = { arrayToRecord };`;
