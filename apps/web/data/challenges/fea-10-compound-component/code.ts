export const starterTs = `function createAccordion() {
  // Implement compound component accordion logic

  return {
    addPanel(_id: string): void {},
    expand(_id: string): void {},
    collapse(_id: string): void {},
    isExpanded(_id: string): boolean { return false; },
    getExpandedIds(): string[] { return []; },
  };
}

export { createAccordion };`;

export const starterJs = `function createAccordion() {
  // Implement compound component accordion logic

  return {
    addPanel(id) {},
    expand(id) {},
    collapse(id) {},
    isExpanded(id) { return false; },
    getExpandedIds() { return []; },
  };
}

module.exports = { createAccordion };`;

export const solutionTs = `function createAccordion() {
  const panels = new Set<string>();
  let expandedId: string | null = null;

  return {
    addPanel(id: string): void { panels.add(id); },
    expand(id: string): void { if (panels.has(id)) expandedId = id; },
    collapse(id: string): void { if (expandedId === id) expandedId = null; },
    isExpanded(id: string): boolean { return expandedId === id; },
    getExpandedIds(): string[] { return expandedId ? [expandedId] : []; },
  };
}

export { createAccordion };`;

export const solutionJs = `function createAccordion() {
  const panels = new Set();
  let expandedId = null;

  return {
    addPanel(id) { panels.add(id); },
    expand(id) { if (panels.has(id)) expandedId = id; },
    collapse(id) { if (expandedId === id) expandedId = null; },
    isExpanded(id) { return expandedId === id; },
    getExpandedIds() { return expandedId ? [expandedId] : []; },
  };
}

module.exports = { createAccordion };`;
