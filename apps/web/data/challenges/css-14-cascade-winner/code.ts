export const starterTs = `function pickWinningRule(rules: Array<{ selector: string; specificity: number }>) {
  // Implement this function
  
}

export { pickWinningRule };`;

export const starterJs = `function pickWinningRule(rules) {
  // Implement this function
  
}

module.exports = { pickWinningRule };`;

export const solutionTs = `function pickWinningRule(rules: Array<{ selector: string; specificity: number }>) {
  return rules.reduce((winner, rule) => (rule.specificity > winner.specificity ? rule : winner));
}

export { pickWinningRule };`;

export const solutionJs = `function pickWinningRule(rules) {
  return rules.reduce((winner, rule) => (rule.specificity > winner.specificity ? rule : winner));
}

module.exports = { pickWinningRule };`;
