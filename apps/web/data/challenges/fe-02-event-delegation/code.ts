export const starterTs = `function addDelegatedListener(
  parent: Element,
  eventType: string,
  selector: string,
  handler: (el: Element, event: Event) => void
): () => void {
  // Attach ONE listener to parent, fire handler for matching children

  return () => {}; // cleanup function
}

export { addDelegatedListener };`;

export const starterJs = `function addDelegatedListener(parent, eventType, selector, handler) {
  // Attach ONE listener to parent, fire handler for matching children

  return () => {}; // cleanup function
}

module.exports = { addDelegatedListener };`;

export const solutionTs = `function addDelegatedListener(
  parent: Element,
  eventType: string,
  selector: string,
  handler: (el: Element, event: Event) => void
): () => void {
  const listener = (event: Event) => {
    const target = event.target as Element;
    const matched = target.closest(selector);
    if (matched && parent.contains(matched)) {
      handler(matched, event);
    }
  };

  parent.addEventListener(eventType, listener);
  return () => parent.removeEventListener(eventType, listener);
}

export { addDelegatedListener };`;

export const solutionJs = `function addDelegatedListener(parent, eventType, selector, handler) {
  const listener = (event) => {
    const target = event.target;
    const matched = target.closest(selector);
    if (matched && parent.contains(matched)) {
      handler(matched, event);
    }
  };

  parent.addEventListener(eventType, listener);
  return () => parent.removeEventListener(eventType, listener);
}

module.exports = { addDelegatedListener };`;
