export const starterTs = `type Status = 'idle' | 'loading' | 'error' | 'success';

interface AsyncState<T> {
  run(fn: () => Promise<T>): Promise<void>;
  getStatus(): Status;
  getData(): T | null;
  getError(): unknown;
  reset(): void;
}

function createAsyncState<T>(): AsyncState<T> {
  // Implement the idle → loading → success/error → (reset → idle) state machine.

  return {
    async run(fn) { await fn(); },
    getStatus() { return 'idle'; },
    getData() { return null; },
    getError() { return null; },
    reset() {},
  };
}

export { createAsyncState };`;

export const starterJs = `function createAsyncState() {
  // Implement the idle → loading → success/error → (reset → idle) state machine.

  return {
    async run(fn) { await fn(); },
    getStatus() { return 'idle'; },
    getData() { return null; },
    getError() { return null; },
    reset() {},
  };
}

module.exports = { createAsyncState };`;

export const solutionTs = `type Status = 'idle' | 'loading' | 'error' | 'success';

interface AsyncState<T> {
  run(fn: () => Promise<T>): Promise<void>;
  getStatus(): Status;
  getData(): T | null;
  getError(): unknown;
  reset(): void;
}

function createAsyncState<T>(): AsyncState<T> {
  let status: Status = 'idle';
  let data: T | null = null;
  let error: unknown = null;

  return {
    async run(fn) {
      status = 'loading';
      error = null;
      try {
        const result = await fn();
        data = result;
        status = 'success';
      } catch (e) {
        error = e;
        status = 'error';
      }
    },
    getStatus() { return status; },
    getData() { return data; },
    getError() { return error; },
    reset() {
      status = 'idle';
      data = null;
      error = null;
    },
  };
}

export { createAsyncState };`;

export const solutionJs = `function createAsyncState() {
  let status = 'idle';
  let data = null;
  let error = null;

  return {
    async run(fn) {
      status = 'loading';
      error = null;
      try {
        const result = await fn();
        data = result;
        status = 'success';
      } catch (e) {
        error = e;
        status = 'error';
      }
    },
    getStatus() { return status; },
    getData() { return data; },
    getError() { return error; },
    reset() {
      status = 'idle';
      data = null;
      error = null;
    },
  };
}

module.exports = { createAsyncState };`;
