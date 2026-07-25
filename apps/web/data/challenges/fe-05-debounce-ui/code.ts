export const starterTs = `function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
): (...args: T) => void {
  // Implement debounce here

  return (...args) => {};
}

export { debounce };`;

export const starterJs = `function debounce(fn, delay) {
  // Implement debounce here

  return (...args) => {};
}

module.exports = { debounce };`;

export const solutionTs = `function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
): (...args: T) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return (...args: T) => {
    if (timerId !== null) clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
      fn(...args);
    }, delay);
  };
}

export { debounce };`;

export const solutionJs = `function debounce(fn, delay) {
  let timerId = null;

  return (...args) => {
    if (timerId !== null) clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
      fn(...args);
    }, delay);
  };
}

module.exports = { debounce };`;
