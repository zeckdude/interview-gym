export const starterTs = `interface Action {
  type: string;
  payload?: unknown;
}

function createReducerStore<S>(
  reducer: (state: S, action: Action) => S,
  initialState: S
) {
  // Implement reducer store here

  return {
    getState(): S { return initialState; },
    dispatch(_action: Action) {},
  };
}

export { createReducerStore };`;

export const starterJs = `function createReducerStore(reducer, initialState) {
  // Implement reducer store here

  return {
    getState() { return initialState; },
    dispatch(action) {},
  };
}

module.exports = { createReducerStore };`;

export const solutionTs = `interface Action {
  type: string;
  payload?: unknown;
}

function createReducerStore<S>(
  reducer: (state: S, action: Action) => S,
  initialState: S
) {
  let state = initialState;

  return {
    getState() { return state; },
    dispatch(action: Action) {
      state = reducer(state, action);
    },
  };
}

export { createReducerStore };`;

export const solutionJs = `function createReducerStore(reducer, initialState) {
  let state = initialState;

  return {
    getState() { return state; },
    dispatch(action) {
      state = reducer(state, action);
    },
  };
}

module.exports = { createReducerStore };`;
