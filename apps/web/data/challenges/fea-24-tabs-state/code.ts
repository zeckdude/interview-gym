export const starterTs = `function createTabs(tabIds: string[], defaultTab: string) {
  // Implement this function
  
}

export { createTabs };`;

export const starterJs = `function createTabs(tabIds, defaultTab) {
  // Implement this function
  
}

module.exports = { createTabs };`;

export const solutionTs = `function createTabs(tabIds: string[], defaultTab: string) {
  let active = defaultTab;
    const tabs = [...tabIds];
    return {
      getTabs() { return tabs; },
      getActive() { return active; },
      setActive(id) {
        if (tabs.includes(id)) active = id;
      },
    };
}

export { createTabs };`;

export const solutionJs = `function createTabs(tabIds, defaultTab) {
  let active = defaultTab;
    const tabs = [...tabIds];
    return {
      getTabs() { return tabs; },
      getActive() { return active; },
      setActive(id) {
        if (tabs.includes(id)) active = id;
      },
    };
}

module.exports = { createTabs };`;
