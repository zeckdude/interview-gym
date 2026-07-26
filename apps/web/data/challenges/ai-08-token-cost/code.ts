export const starterTs = `function tokenCost(tokens: number, pricePer1k: number) {
  // Implement this function
  
}

export { tokenCost };`;

export const starterJs = `function tokenCost(tokens, pricePer1k) {
  // Implement this function
  
}

module.exports = { tokenCost };`;

export const solutionTs = `function tokenCost(tokens: number, pricePer1k: number) {
  return (tokens / 1000) * pricePer1k;
}

export { tokenCost };`;

export const solutionJs = `function tokenCost(tokens, pricePer1k) {
  return (tokens / 1000) * pricePer1k;
}

module.exports = { tokenCost };`;
