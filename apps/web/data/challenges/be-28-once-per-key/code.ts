export const starterTs = `function oncePerKey() {
  // Implement this function
  
}

export { oncePerKey };`;

export const starterJs = `function oncePerKey() {
  // Implement this function
  
}

module.exports = { oncePerKey };`;

export const solutionTs = `function oncePerKey() {
  const seen = new Set();
    return (key, fn) => {
      if (seen.has(key)) return false;
      seen.add(key);
      fn();
      return true;
    };
}

export { oncePerKey };`;

export const solutionJs = `function oncePerKey() {
  const seen = new Set();
    return (key, fn) => {
      if (seen.has(key)) return false;
      seen.add(key);
      fn();
      return true;
    };
}

module.exports = { oncePerKey };`;
