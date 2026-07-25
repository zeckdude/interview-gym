export const starterTs = `type Status = 'idle' | 'pending' | 'resolved' | 'rejected';

function createSuspenseBoundary<F>(options: { fallback: F }) {
  // Implement suspense boundary logic

  let status: Status = 'idle';
  let result: unknown = null;
  let error: unknown = null;

  return {
    render<R>(asyncFn: () => Promise<R>): Promise<R> {
      return asyncFn();
    },
    getStatus(): Status { return status; },
    getResult(): unknown { return result; },
    getError(): unknown { return error; },
    getFallback(): F { return options.fallback; },
  };
}

export { createSuspenseBoundary };`;

export const starterJs = `function createSuspenseBoundary({ fallback }) {
  let status = 'idle';
  let result = null;
  let error = null;

  return {
    render(asyncFn) {
      return asyncFn();
    },
    getStatus() { return status; },
    getResult() { return result; },
    getError() { return error; },
    getFallback() { return fallback; },
  };
}

module.exports = { createSuspenseBoundary };`;

export const solutionTs = `type Status = 'idle' | 'pending' | 'resolved' | 'rejected';

function createSuspenseBoundary<F>(options: { fallback: F }) {
  let status: Status = 'idle';
  let result: unknown = null;
  let error: unknown = null;

  return {
    render<R>(asyncFn: () => Promise<R>): Promise<R> {
      status = 'pending';
      const promise = asyncFn();
      // Attach both handlers to the original promise so status updates
      // run in the same microtask turn as the caller's await.
      promise.then(
        (r) => {
          status = 'resolved';
          result = r;
        },
        (e) => {
          status = 'rejected';
          error = e;
        }
      );
      return promise;
    },
    getStatus(): Status { return status; },
    getResult(): unknown { return result; },
    getError(): unknown { return error; },
    getFallback(): F { return options.fallback; },
  };
}

export { createSuspenseBoundary };`;

export const solutionJs = `function createSuspenseBoundary({ fallback }) {
  let status = 'idle';
  let result = null;
  let error = null;

  return {
    render(asyncFn) {
      status = 'pending';
      const promise = asyncFn();
      promise.then(
        (r) => { status = 'resolved'; result = r; },
        (e) => { status = 'rejected'; error = e; }
      );
      return promise;
    },
    getStatus() { return status; },
    getResult() { return result; },
    getError() { return error; },
    getFallback() { return fallback; },
  };
}

module.exports = { createSuspenseBoundary };`;
