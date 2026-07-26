export const starterTs = `function createPubSub() {
  // Implement this function
  
}

export { createPubSub };`;

export const starterJs = `function createPubSub() {
  // Implement this function
  
}

module.exports = { createPubSub };`;

export const solutionTs = `function createPubSub() {
  const listeners = new Map();
    return {
      subscribe(event, fn) {
        if (!listeners.has(event)) listeners.set(event, new Set());
        listeners.get(event).add(fn);
        return () => listeners.get(event)?.delete(fn);
      },
      publish(event, payload) {
        for (const fn of listeners.get(event) ?? []) fn(payload);
      },
    };
}

export { createPubSub };`;

export const solutionJs = `function createPubSub() {
  const listeners = new Map();
    return {
      subscribe(event, fn) {
        if (!listeners.has(event)) listeners.set(event, new Set());
        listeners.get(event).add(fn);
        return () => listeners.get(event)?.delete(fn);
      },
      publish(event, payload) {
        for (const fn of listeners.get(event) ?? []) fn(payload);
      },
    };
}

module.exports = { createPubSub };`;
