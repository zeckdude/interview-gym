export const starterTs = `function budgetContext(messages: string[], maxTokens: number) {
  // Implement this function
  
}

export { budgetContext };`;

export const starterJs = `function budgetContext(messages, maxTokens) {
  // Implement this function
  
}

module.exports = { budgetContext };`;

export const solutionTs = `function budgetContext(messages: string[], maxTokens: number) {
  let used = 0;
    const kept = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const cost = Math.ceil(String(messages[i]).length / 4);
      if (used + cost > maxTokens) break;
      used += cost;
      kept.unshift(messages[i]);
    }
    return kept;
}

export { budgetContext };`;

export const solutionJs = `function budgetContext(messages, maxTokens) {
  let used = 0;
    const kept = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const cost = Math.ceil(String(messages[i]).length / 4);
      if (used + cost > maxTokens) break;
      used += cost;
      kept.unshift(messages[i]);
    }
    return kept;
}

module.exports = { budgetContext };`;
