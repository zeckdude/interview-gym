export const starterTs = `interface StateConfig {
  on: Record<string, string>;
}

interface MachineConfig {
  initial: string;
  states: Record<string, StateConfig>;
}

function createStateMachine(config: MachineConfig) {
  // Implement finite state machine

  return {
    getState(): string { return config.initial; },
    send(_event: string): void {},
    can(_event: string): boolean { return false; },
  };
}

export { createStateMachine };`;

export const starterJs = `function createStateMachine({ initial, states }) {
  // Implement finite state machine

  return {
    getState() { return initial; },
    send(event) {},
    can(event) { return false; },
  };
}

module.exports = { createStateMachine };`;

export const solutionTs = `interface StateConfig {
  on: Record<string, string>;
}

function createStateMachine(config: { initial: string; states: Record<string, StateConfig> }) {
  let current = config.initial;

  return {
    getState(): string { return current; },
    send(event: string): void {
      const next = config.states[current]?.on[event];
      if (next) current = next;
    },
    can(event: string): boolean {
      return event in (config.states[current]?.on ?? {});
    },
  };
}

export { createStateMachine };`;

export const solutionJs = `function createStateMachine({ initial, states }) {
  let current = initial;

  return {
    getState() { return current; },
    send(event) {
      const next = states[current]?.on[event];
      if (next) current = next;
    },
    can(event) {
      return event in (states[current]?.on ?? {});
    },
  };
}

module.exports = { createStateMachine };`;
