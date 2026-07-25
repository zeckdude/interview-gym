export const starterTs = `interface StateMachineConfig {
  initial: string;
  states: Record<string, Record<string, string>>;
}

function createStateMachine(config: StateMachineConfig) {
  // Implement state machine here

  return {
    getState(): string { return config.initial; },
    send(_event: string): void {},
  };
}

export { createStateMachine };`;

export const starterJs = `function createStateMachine({ initial, states }) {
  // Implement state machine here

  return {
    getState() { return initial; },
    send(event) {},
  };
}

module.exports = { createStateMachine };`;

export const solutionTs = `interface StateMachineConfig {
  initial: string;
  states: Record<string, Record<string, string>>;
}

function createStateMachine(config: StateMachineConfig) {
  let current = config.initial;

  return {
    getState() { return current; },
    send(event: string) {
      const transitions = config.states[current];
      if (transitions && event in transitions) {
        current = transitions[event];
      }
    },
  };
}

export { createStateMachine };`;

export const solutionJs = `function createStateMachine({ initial, states }) {
  let current = initial;

  return {
    getState() { return current; },
    send(event) {
      const transitions = states[current];
      if (transitions && event in transitions) {
        current = transitions[event];
      }
    },
  };
}

module.exports = { createStateMachine };`;
