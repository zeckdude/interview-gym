export const starterTs = `function debounce(
  fn: (...args: unknown[]) => void,
  delay: number
) {
  // Implement debounce with a .cancel() method
  
}

export { debounce };`;

export const starterJs = `function debounce(fn, delay) {
  // Implement debounce with a .cancel() method
  
}

module.exports = { debounce };`;

export const solutionTs = `function debounce(fn, delay) {
  let timerId = null;

  const debounced = (...args) => {
    if (timerId !== null) clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
      fn(...args);
    }, delay);
  };

  debounced.cancel = () => {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  return debounced;
}

export { debounce };`;

export const solutionJs = `function debounce(fn, delay) {
  let timerId = null;

  function debounced(...args) {
    if (timerId !== null) clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
      fn(...args);
    }, delay);
  }

  debounced.cancel = () => {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  return debounced;
}

module.exports = { debounce };`;
