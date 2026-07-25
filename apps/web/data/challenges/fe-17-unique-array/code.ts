export const starterTs = `function unique<T>(arr: T[]): T[] {
  // Return array with duplicates removed
  return arr;
}

function uniqueBy<T>(arr: T[], keyFn: (item: T) => unknown): T[] {
  // Return array with duplicates removed by key function
  return arr;
}

export { unique, uniqueBy };`;

export const starterJs = `function unique(arr) {
  // Return array with duplicates removed
  return arr;
}

function uniqueBy(arr, keyFn) {
  // Return array with duplicates removed by key function
  return arr;
}

module.exports = { unique, uniqueBy };`;

export const solutionTs = `function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function uniqueBy<T>(arr: T[], keyFn: (item: T) => unknown): T[] {
  const seen = new Set<unknown>();
  return arr.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export { unique, uniqueBy };`;

export const solutionJs = `function unique(arr) {
  return Array.from(new Set(arr));
}

function uniqueBy(arr, keyFn) {
  const seen = new Set();
  return arr.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

module.exports = { unique, uniqueBy };`;
