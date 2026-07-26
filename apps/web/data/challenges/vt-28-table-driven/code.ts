export const starterTs = `function runTable(rows: Array<{ n: number }>, fn: (row: { n: number }) => boolean) {
  // Implement this function
  
}

export { runTable };`;

export const starterJs = `function runTable(rows, fn) {
  // Implement this function
  
}

module.exports = { runTable };`;

export const solutionTs = `function runTable(rows: Array<{ n: number }>, fn: (row: { n: number }) => boolean) {
  return rows.every((row) => fn(row) === true);
}

export { runTable };`;

export const solutionJs = `function runTable(rows, fn) {
  return rows.every((row) => fn(row) === true);
}

module.exports = { runTable };`;
