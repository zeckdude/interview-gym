export const starterTs = `interface VNode {
  type: string;
  props: Record<string, unknown>;
  children?: VNode[];
  text?: string;
}

interface Patch {
  type: 'UPDATE' | 'REPLACE' | 'ADD' | 'REMOVE';
  path: string;
  value?: unknown;
}

function diff(oldTree: VNode, newTree: VNode, path = ''): Patch[] {
  const patches: Patch[] = [];

  // Implement diffing algorithm here

  return patches;
}

export { diff };`;

export const starterJs = `function diff(oldTree, newTree, path = '') {
  const patches = [];

  // Implement diffing algorithm here

  return patches;
}

module.exports = { diff };`;

export const solutionTs = `interface VNode {
  type: string;
  props: Record<string, unknown>;
  children?: VNode[];
  text?: string;
}

interface Patch {
  type: 'UPDATE' | 'REPLACE' | 'ADD' | 'REMOVE';
  path: string;
  value?: unknown;
}

function diff(oldTree: VNode, newTree: VNode, path = ''): Patch[] {
  const patches: Patch[] = [];

  if (oldTree.type !== newTree.type) {
    patches.push({ type: 'REPLACE', path: path || 'root', value: newTree });
    return patches;
  }

  const oldProps = oldTree.props || {};
  const newProps = newTree.props || {};
  const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);

  for (const key of allKeys) {
    const propPath = path ? \`\${path}.props.\${key}\` : \`props.\${key}\`;
    if (!(key in newProps)) {
      patches.push({ type: 'REMOVE', path: propPath });
    } else if (!(key in oldProps)) {
      patches.push({ type: 'ADD', path: propPath, value: newProps[key] });
    } else if (oldProps[key] !== newProps[key]) {
      patches.push({ type: 'UPDATE', path: propPath, value: newProps[key] });
    }
  }

  return patches;
}

export { diff };`;

export const solutionJs = `function diff(oldTree, newTree, path = '') {
  const patches = [];

  if (oldTree.type !== newTree.type) {
    patches.push({ type: 'REPLACE', path: path || 'root', value: newTree });
    return patches;
  }

  const oldProps = oldTree.props || {};
  const newProps = newTree.props || {};
  const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);

  for (const key of allKeys) {
    const propPath = path ? \`\${path}.props.\${key}\` : \`props.\${key}\`;
    if (!(key in newProps)) {
      patches.push({ type: 'REMOVE', path: propPath });
    } else if (!(key in oldProps)) {
      patches.push({ type: 'ADD', path: propPath, value: newProps[key] });
    } else if (oldProps[key] !== newProps[key]) {
      patches.push({ type: 'UPDATE', path: propPath, value: newProps[key] });
    }
  }

  return patches;
}

module.exports = { diff };`;
