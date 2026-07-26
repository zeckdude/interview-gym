export const starterTs = `function parseSearchParams(query: string) {
  // Implement this function
  
}

export { parseSearchParams };`;

export const starterJs = `function parseSearchParams(query) {
  // Implement this function
  
}

module.exports = { parseSearchParams };`;

export const solutionTs = `function parseSearchParams(query: string) {
  const params = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
    const result = {};
    for (const [key, value] of params.entries()) {
      if (result[key] === undefined) result[key] = value;
      else if (Array.isArray(result[key])) result[key].push(value);
      else result[key] = [result[key], value];
    }
    return result;
}

export { parseSearchParams };`;

export const solutionJs = `function parseSearchParams(query) {
  const params = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
    const result = {};
    for (const [key, value] of params.entries()) {
      if (result[key] === undefined) result[key] = value;
      else if (Array.isArray(result[key])) result[key].push(value);
      else result[key] = [result[key], value];
    }
    return result;
}

module.exports = { parseSearchParams };`;
