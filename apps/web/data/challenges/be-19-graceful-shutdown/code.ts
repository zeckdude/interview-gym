export const starterTs = `interface ShutdownManager {
  onShutdown(handler: (reason?: string) => Promise<void>): void;
  shutdown(reason?: string): Promise<void>;
}

function createShutdownManager(): ShutdownManager {
  // Implement graceful shutdown manager here

  return {
    onShutdown(handler) {},
    async shutdown(reason) {},
  };
}

export { createShutdownManager };`;

export const starterJs = `function createShutdownManager() {
  // Implement graceful shutdown manager here

  return {
    onShutdown(handler) {},
    async shutdown(reason) {},
  };
}

module.exports = { createShutdownManager };`;

export const solutionTs = `interface ShutdownManager {
  onShutdown(handler: (reason?: string) => Promise<void>): void;
  shutdown(reason?: string): Promise<void>;
}

function createShutdownManager(): ShutdownManager {
  const handlers: Array<(reason?: string) => Promise<void>> = [];
  let shuttingDown = false;
  let shutdownPromise: Promise<void> | null = null;

  return {
    onShutdown(handler) {
      handlers.push(handler);
    },
    shutdown(reason) {
      if (shuttingDown) return shutdownPromise!;
      shuttingDown = true;
      shutdownPromise = (async () => {
        for (const handler of handlers) {
          await handler(reason);
        }
      })();
      return shutdownPromise;
    },
  };
}

export { createShutdownManager };`;

export const solutionJs = `function createShutdownManager() {
  const handlers = [];
  let shuttingDown = false;
  let shutdownPromise = null;

  return {
    onShutdown(handler) {
      handlers.push(handler);
    },
    shutdown(reason) {
      if (shuttingDown) return shutdownPromise;
      shuttingDown = true;
      shutdownPromise = (async () => {
        for (const handler of handlers) {
          await handler(reason);
        }
      })();
      return shutdownPromise;
    },
  };
}

module.exports = { createShutdownManager };`;
