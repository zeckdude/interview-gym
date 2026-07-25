export const starterTs = `interface JobQueue {
  add<T>(job: () => Promise<T>): Promise<T>;
}

function createJobQueue(concurrency: number): JobQueue {
  // Implement concurrency-limited job queue here

  return {
    add(job) {
      return job();
    },
  };
}

export { createJobQueue };`;

export const starterJs = `function createJobQueue(concurrency) {
  // Implement concurrency-limited job queue here

  return {
    add(job) {
      return job();
    },
  };
}

module.exports = { createJobQueue };`;

export const solutionTs = `interface JobQueue {
  add<T>(job: () => Promise<T>): Promise<T>;
}

function createJobQueue(concurrency: number): JobQueue {
  let active = 0;
  const pending: Array<() => void> = [];

  function next() {
    if (pending.length > 0 && active < concurrency) {
      const run = pending.shift()!;
      run();
    }
  }

  return {
    add<T>(job: () => Promise<T>): Promise<T> {
      return new Promise<T>((resolve, reject) => {
        const run = async () => {
          active++;
          try {
            const result = await job();
            resolve(result);
          } catch (err) {
            reject(err);
          } finally {
            active--;
            next();
          }
        };

        if (active < concurrency) {
          run();
        } else {
          pending.push(run);
        }
      });
    },
  };
}

export { createJobQueue };`;

export const solutionJs = `function createJobQueue(concurrency) {
  let active = 0;
  const pending = [];

  function next() {
    if (pending.length > 0 && active < concurrency) {
      const run = pending.shift();
      run();
    }
  }

  return {
    add(job) {
      return new Promise((resolve, reject) => {
        const run = async () => {
          active++;
          try {
            const result = await job();
            resolve(result);
          } catch (err) {
            reject(err);
          } finally {
            active--;
            next();
          }
        };

        if (active < concurrency) {
          run();
        } else {
          pending.push(run);
        }
      });
    },
  };
}

module.exports = { createJobQueue };`;
