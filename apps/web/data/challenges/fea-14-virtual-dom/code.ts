export const starterTs = `interface VNode {
  type: string;
  props: Record<string, unknown>;
  children: VNode[];
  text?: string;
}

type Patch =
  | { type: 'REPLACE' }
  | { type: 'TEXT_CHANGE'; oldText: string; newText: string }
  | { type: 'UPDATE_PROPS'; key: string; oldValue: unknown; newValue: unknown }
  | { type: 'REMOVE'; key: string }
  | { type: 'ADD'; key: string; value: unknown };

function diff(oldNode: VNode, newNode: VNode): Patch[] {
  const patches: Patch[] = [];
  // Implement virtual DOM diffing

  return patches;
}

export { diff };`;

export const starterJs = `function diff(oldNode, newNode) {
  const patches = [];
  // Implement virtual DOM diffing

  return patches;
}

module.exports = { diff };`;

export const solutionTs = `interface VNode {
  type: string;
  props: Record<string, unknown>;
  children: VNode[];
  text?: string;
}

type Patch =
  | { type: 'REPLACE' }
  | { type: 'TEXT_CHANGE'; oldText: string; newText: string }
  | { type: 'UPDATE_PROPS'; key: string; oldValue: unknown; newValue: unknown }
  | { type: 'REMOVE'; key: string }
  | { type: 'ADD'; key: string; value: unknown };

function diff(oldNode: VNode, newNode: VNode): Patch[] {
  const patches: Patch[] = [];

  if (oldNode.type !== newNode.type) {
    return [{ type: 'REPLACE' }];
  }

  if (oldNode.text !== undefined || newNode.text !== undefined) {
    if (oldNode.text !== newNode.text) {
      patches.push({ type: 'TEXT_CHANGE', oldText: oldNode.text ?? '', newText: newNode.text ?? '' });
    }
    return patches;
  }

  const allKeys = new Set([...Object.keys(oldNode.props), ...Object.keys(newNode.props)]);
  for (const key of allKeys) {
    const oldVal = oldNode.props[key];
    const newVal = newNode.props[key];
    if (!(key in newNode.props)) {
      patches.push({ type: 'REMOVE', key });
    } else if (!(key in oldNode.props)) {
      patches.push({ type: 'ADD', key, value: newVal });
    } else if (oldVal !== newVal) {
      patches.push({ type: 'UPDATE_PROPS', key, oldValue: oldVal, newValue: newVal });
    }
  }

  return patches;
}

export { diff };`;

export const solutionJs = `function diff(oldNode, newNode) {
  const patches = [];

  if (oldNode.type !== newNode.type) {
    return [{ type: 'REPLACE' }];
  }

  if (oldNode.text !== undefined || newNode.text !== undefined) {
    if (oldNode.text !== newNode.text) {
      patches.push({ type: 'TEXT_CHANGE', oldText: oldNode.text ?? '', newText: newNode.text ?? '' });
    }
    return patches;
  }

  const allKeys = new Set([...Object.keys(oldNode.props), ...Object.keys(newNode.props)]);
  for (const key of allKeys) {
    const oldVal = oldNode.props[key];
    const newVal = newNode.props[key];
    if (!(key in newNode.props)) {
      patches.push({ type: 'REMOVE', key });
    } else if (!(key in oldNode.props)) {
      patches.push({ type: 'ADD', key, value: newVal });
    } else if (oldVal !== newVal) {
      patches.push({ type: 'UPDATE_PROPS', key, oldValue: oldVal, newValue: newVal });
    }
  }

  return patches;
}

module.exports = { diff };`;
