export const starterTs = `function throttle<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
): (...args: T) => void {
  // Fire on leading edge, ignore subsequent calls within delay ms

  return (...args) => {};
}

export { throttle };`;

export const starterJs = `function throttle(fn, delay) {
  // Fire on leading edge, ignore subsequent calls within delay ms

  return (...args) => {};
}

module.exports = { throttle };`;

export const solutionTs = `function throttle<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
): (...args: T) => void {
  let lastCall = 0;

  return (...args: T) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

export { throttle };`;

export const solutionJs = `function throttle(fn, delay) {
  let lastCall = 0;

  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

module.exports = { throttle };`;
