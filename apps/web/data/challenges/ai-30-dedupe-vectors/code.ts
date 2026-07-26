export const starterTs = `function dedupeSimilar(items: Array<{ id: string; vector: number[] }>, threshold: number, similarity: (a: number[], b: number[]) => number) {
  // Implement this function
  
}

export { dedupeSimilar };`;

export const starterJs = `function dedupeSimilar(items, threshold, similarity) {
  // Implement this function
  
}

module.exports = { dedupeSimilar };`;

export const solutionTs = `function dedupeSimilar(items: Array<{ id: string; vector: number[] }>, threshold: number, similarity: (a: number[], b: number[]) => number) {
  const kept = [];
    for (const item of items) {
      if (!kept.some((k) => similarity(k.vector, item.vector) >= threshold)) kept.push(item);
    }
    return kept;
}

export { dedupeSimilar };`;

export const solutionJs = `function dedupeSimilar(items, threshold, similarity) {
  const kept = [];
    for (const item of items) {
      if (!kept.some((k) => similarity(k.vector, item.vector) >= threshold)) kept.push(item);
    }
    return kept;
}

module.exports = { dedupeSimilar };`;
