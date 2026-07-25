export const starterTs = `type Props = Record<string, unknown>;

function withLogger<T extends Props, R>(
  renderFn: (props: T) => R,
  componentName = 'Component'
) {
  const logs: string[] = [];

  return {
    render(props: T): R {
      // Log before render and call original function
      return renderFn(props);
    },
    getLogs(): string[] {
      return logs;
    },
  };
}

export { withLogger };`;

export const starterJs = `function withLogger(renderFn, componentName = 'Component') {
  const logs = [];

  return {
    render(props) {
      // Log before render and call original function
      return renderFn(props);
    },
    getLogs() {
      return logs;
    },
  };
}

module.exports = { withLogger };`;

export const solutionTs = `type Props = Record<string, unknown>;

function withLogger<T extends Props, R>(
  renderFn: (props: T) => R,
  componentName = 'Component'
) {
  const logs: string[] = [];

  return {
    render(props: T): R {
      logs.push(\`[\${componentName}] render \${JSON.stringify(props)}\`);
      return renderFn(props);
    },
    getLogs() { return logs; },
  };
}

export { withLogger };`;

export const solutionJs = `function withLogger(renderFn, componentName = 'Component') {
  const logs = [];

  return {
    render(props) {
      logs.push(\`[\${componentName}] render \${JSON.stringify(props)}\`);
      return renderFn(props);
    },
    getLogs() { return logs; },
  };
}

module.exports = { withLogger };`;
