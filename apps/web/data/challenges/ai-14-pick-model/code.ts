export const starterTs = `function pickModel(complexity: 'low' | 'medium' | 'high', models: Record<string, string>) {
  // Implement this function
  
}

export { pickModel };`;

export const starterJs = `function pickModel(complexity, models) {
  // Implement this function
  
}

module.exports = { pickModel };`;

export const solutionTs = `function pickModel(complexity: 'low' | 'medium' | 'high', models: Record<string, string>) {
  if (complexity === 'high') return models.large;
    if (complexity === 'medium') return models.medium;
    return models.small;
}

export { pickModel };`;

export const solutionJs = `function pickModel(complexity, models) {
  if (complexity === 'high') return models.large;
    if (complexity === 'medium') return models.medium;
    return models.small;
}

module.exports = { pickModel };`;
