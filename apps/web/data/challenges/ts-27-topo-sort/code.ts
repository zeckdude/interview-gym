export const starterTs = `function topoSort(graph: Record<string, string[]>) {
  // Implement this function
  
}

export { topoSort };`;

export const starterJs = `function topoSort(graph) {
  // Implement this function
  
}

module.exports = { topoSort };`;

export const solutionTs = `function topoSort(graph: Record<string, string[]>) {
  const visited = new Set();
    const temp = new Set();
    const result = [];
    const visit = (node) => {
      if (temp.has(node)) throw new Error('Cycle');
      if (visited.has(node)) return;
      temp.add(node);
      for (const dep of graph[node] ?? []) visit(dep);
      temp.delete(node);
      visited.add(node);
      result.push(node);
    };
    for (const node of Object.keys(graph)) visit(node);
    return result.reverse();
}

export { topoSort };`;

export const solutionJs = `function topoSort(graph) {
  const visited = new Set();
    const temp = new Set();
    const result = [];
    const visit = (node) => {
      if (temp.has(node)) throw new Error('Cycle');
      if (visited.has(node)) return;
      temp.add(node);
      for (const dep of graph[node] ?? []) visit(dep);
      temp.delete(node);
      visited.add(node);
      result.push(node);
    };
    for (const node of Object.keys(graph)) visit(node);
    return result.reverse();
}

module.exports = { topoSort };`;
