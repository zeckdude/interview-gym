export const starterTs = `function promiseAll<T>(promises: Array<T | Promise<T>>): Promise<T[]> {
  // Implement Promise.all from scratch
  return Promise.resolve([]);
}

export { promiseAll };`;

export const starterJs = `function promiseAll(promises) {
  // Implement Promise.all from scratch
  return Promise.resolve([]);
}

module.exports = { promiseAll };`;

export const solutionTs = `function promiseAll<T>(promises: Array<T | Promise<T>>): Promise<T[]> {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) { resolve([]); return; }
    const results: T[] = new Array(promises.length);
    let remaining = promises.length;

    promises.forEach((p, i) => {
      Promise.resolve(p).then((value) => {
        results[i] = value;
        remaining--;
        if (remaining === 0) resolve(results);
      }).catch(reject);
    });
  });
}

export { promiseAll };`;

export const solutionJs = `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) { resolve([]); return; }
    const results = new Array(promises.length);
    let remaining = promises.length;

    promises.forEach((p, i) => {
      Promise.resolve(p).then((value) => {
        results[i] = value;
        remaining--;
        if (remaining === 0) resolve(results);
      }).catch(reject);
    });
  });
}

module.exports = { promiseAll };`;
