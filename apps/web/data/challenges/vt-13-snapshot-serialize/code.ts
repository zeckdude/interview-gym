export const starterTs = `function snapshotValue(value: unknown) {
  // Implement this function
  
}

export { snapshotValue };`;

export const starterJs = `function snapshotValue(value) {
  // Implement this function
  
}

module.exports = { snapshotValue };`;

export const solutionTs = `function snapshotValue(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export { snapshotValue };`;

export const solutionJs = `function snapshotValue(value) {
  return JSON.stringify(value, null, 2);
}

module.exports = { snapshotValue };`;
