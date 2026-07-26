export const starterTs = `function computeEvalMetrics(results: Array<{ expected: string; actual: string }>) {
  // Implement this function
  
}

export { computeEvalMetrics };`;

export const starterJs = `function computeEvalMetrics(results) {
  // Implement this function
  
}

module.exports = { computeEvalMetrics };`;

export const solutionTs = `function computeEvalMetrics(results: Array<{ expected: string; actual: string }>) {
  const tp = results.filter((r) => r.expected === r.actual).length;
    return { accuracy: tp / results.length, total: results.length };
}

export { computeEvalMetrics };`;

export const solutionJs = `function computeEvalMetrics(results) {
  const tp = results.filter((r) => r.expected === r.actual).length;
    return { accuracy: tp / results.length, total: results.length };
}

module.exports = { computeEvalMetrics };`;
