export const starterTs = `function createToolRegistry() {
  // Implement this function
  
}

export { createToolRegistry };`;

export const starterJs = `function createToolRegistry() {
  // Implement this function
  
}

module.exports = { createToolRegistry };`;

export const solutionTs = `function createToolRegistry() {
  const tools = {};
    return {
      register(name, handler) { tools[name] = handler; },
      call(name, input) { return tools[name](input); },
    };
}

export { createToolRegistry };`;

export const solutionJs = `function createToolRegistry() {
  const tools = {};
    return {
      register(name, handler) { tools[name] = handler; },
      call(name, input) { return tools[name](input); },
    };
}

module.exports = { createToolRegistry };`;
