export const starterTs = `type Props = Record<string, unknown>;

function shallowEqual(a: Props, b: Props): boolean {
  // Implement shallow equality check
  return a === b;
}

function createMemoComponent<T extends Props, R>(
  renderFn: (props: T) => R,
  areEqual?: (prev: T, next: T) => boolean
) {
  // Cache the last render
  return {
    render(props: T): R {
      return renderFn(props);
    },
  };
}

export { createMemoComponent, shallowEqual };`;

export const starterJs = `function shallowEqual(a, b) {
  // Implement shallow equality check
  return a === b;
}

function createMemoComponent(renderFn, areEqual) {
  // Cache the last render
  return {
    render(props) {
      return renderFn(props);
    },
  };
}

module.exports = { createMemoComponent, shallowEqual };`;

export const solutionTs = `type Props = Record<string, unknown>;

function shallowEqual(a: Props, b: Props): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => a[k] === b[k]);
}

function createMemoComponent<T extends Props, R>(
  renderFn: (props: T) => R,
  areEqual: (prev: T, next: T) => boolean = shallowEqual as unknown as (a: T, b: T) => boolean
) {
  let lastProps: T | null = null;
  let lastResult: R | null = null;
  let hasRendered = false;

  return {
    render(props: T): R {
      if (hasRendered && lastProps !== null && areEqual(lastProps, props)) {
        return lastResult!;
      }
      lastProps = props;
      lastResult = renderFn(props);
      hasRendered = true;
      return lastResult;
    },
  };
}

export { createMemoComponent, shallowEqual };`;

export const solutionJs = `function shallowEqual(a, b) {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => a[k] === b[k]);
}

function createMemoComponent(renderFn, areEqual = shallowEqual) {
  let lastProps = null;
  let lastResult = null;
  let hasRendered = false;

  return {
    render(props) {
      if (hasRendered && lastProps !== null && areEqual(lastProps, props)) {
        return lastResult;
      }
      lastProps = props;
      lastResult = renderFn(props);
      hasRendered = true;
      return lastResult;
    },
  };
}

module.exports = { createMemoComponent, shallowEqual };`;
