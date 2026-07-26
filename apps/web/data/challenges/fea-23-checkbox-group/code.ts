export const starterTs = `function createCheckboxGroup(initial?: string[]) {
  // Implement this function
  
}

export { createCheckboxGroup };`;

export const starterJs = `function createCheckboxGroup(initial = []) {
  // Implement this function
  
}

module.exports = { createCheckboxGroup };`;

export const solutionTs = `function createCheckboxGroup(initial?: string[]) {
  const selected = new Set(initial);
    return {
      isChecked(id) { return selected.has(id); },
      toggle(id) {
        if (selected.has(id)) selected.delete(id);
        else selected.add(id);
      },
      getSelected() { return [...selected]; },
      clear() { selected.clear(); },
    };
}

export { createCheckboxGroup };`;

export const solutionJs = `function createCheckboxGroup(initial = []) {
  const selected = new Set(initial);
    return {
      isChecked(id) { return selected.has(id); },
      toggle(id) {
        if (selected.has(id)) selected.delete(id);
        else selected.add(id);
      },
      getSelected() { return [...selected]; },
      clear() { selected.clear(); },
    };
}

module.exports = { createCheckboxGroup };`;
