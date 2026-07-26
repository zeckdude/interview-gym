export const starterTs = `function checkGuardrail(input: string, rules: string[]) {
  // Implement this function
  
}

export { checkGuardrail };`;

export const starterJs = `function checkGuardrail(input, rules) {
  // Implement this function
  
}

module.exports = { checkGuardrail };`;

export const solutionTs = `function checkGuardrail(input: string, rules: string[]) {
  const blocked = rules.some((rule) => input.toLowerCase().includes(rule));
    return { allowed: !blocked, blocked };
}

export { checkGuardrail };`;

export const solutionJs = `function checkGuardrail(input, rules) {
  const blocked = rules.some((rule) => input.toLowerCase().includes(rule));
    return { allowed: !blocked, blocked };
}

module.exports = { checkGuardrail };`;
