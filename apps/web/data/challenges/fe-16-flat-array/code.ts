export const starterTs = `function flatten(arr: unknown[], depth = Infinity): unknown[] {
  // Flatten nested arrays to the given depth
  return arr;
}

export { flatten };`;

export const starterJs = `function flatten(arr, depth = Infinity) {
  // Flatten nested arrays to the given depth
  return arr;
}

module.exports = { flatten };`;

export const solutionTs = `function flatten(arr: unknown[], depth = Infinity): unknown[] {
  return arr.reduce<unknown[]>((acc, item) => {
    if (Array.isArray(item) && depth > 0) {
      acc.push(...flatten(item as unknown[], depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}

export { flatten };`;

export const solutionJs = `function flatten(arr, depth = Infinity) {
  return arr.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0) {
      acc.push(...flatten(item, depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}

module.exports = { flatten };`;
