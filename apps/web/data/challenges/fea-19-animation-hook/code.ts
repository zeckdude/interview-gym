export const starterTs = `type AnimationState = 'idle' | 'playing' | 'paused' | 'finished';

interface AnimationOptions {
  duration: number;
  clock?: { now(): number };
}

function createAnimationController(options: AnimationOptions) {
  // Implement animation controller

  return {
    play(): void {},
    pause(): void {},
    stop(): void {},
    getState(): AnimationState { return 'idle'; },
    getProgress(): number { return 0; },
  };
}

export { createAnimationController };`;

export const starterJs = `function createAnimationController({ duration, clock = Date }) {
  // Implement animation controller

  return {
    play() {},
    pause() {},
    stop() {},
    getState() { return 'idle'; },
    getProgress() { return 0; },
  };
}

module.exports = { createAnimationController };`;

export const solutionTs = `type AnimationState = 'idle' | 'playing' | 'paused' | 'finished';

function createAnimationController(options: { duration: number; clock?: { now(): number } }) {
  const clock = options.clock ?? { now: () => Date.now() };
  const { duration } = options;

  let state: AnimationState = 'idle';
  let startTime = 0;
  let pausedProgress = 0;

  return {
    play(): void {
      if (state === 'playing') return;
      startTime = clock.now() - pausedProgress * duration;
      state = 'playing';
    },
    pause(): void {
      if (state !== 'playing') return;
      pausedProgress = Math.min(1, (clock.now() - startTime) / duration);
      state = 'paused';
    },
    stop(): void {
      state = 'idle';
      pausedProgress = 0;
      startTime = 0;
    },
    getState(): AnimationState {
      if (state === 'playing') {
        const p = (clock.now() - startTime) / duration;
        if (p >= 1) { state = 'finished'; pausedProgress = 1; }
      }
      return state;
    },
    getProgress(): number {
      if (state === 'idle') return 0;
      if (state === 'paused' || state === 'finished') return pausedProgress;
      const p = (clock.now() - startTime) / duration;
      if (p >= 1) { state = 'finished'; pausedProgress = 1; return 1; }
      return Math.max(0, p);
    },
  };
}

export { createAnimationController };`;

export const solutionJs = `function createAnimationController({ duration, clock = { now: () => Date.now() } }) {
  let state = 'idle';
  let startTime = 0;
  let pausedProgress = 0;

  return {
    play() {
      if (state === 'playing') return;
      startTime = clock.now() - pausedProgress * duration;
      state = 'playing';
    },
    pause() {
      if (state !== 'playing') return;
      pausedProgress = Math.min(1, (clock.now() - startTime) / duration);
      state = 'paused';
    },
    stop() {
      state = 'idle';
      pausedProgress = 0;
      startTime = 0;
    },
    getState() {
      if (state === 'playing') {
        const p = (clock.now() - startTime) / duration;
        if (p >= 1) { state = 'finished'; pausedProgress = 1; }
      }
      return state;
    },
    getProgress() {
      if (state === 'idle') return 0;
      if (state === 'paused' || state === 'finished') return pausedProgress;
      const p = (clock.now() - startTime) / duration;
      if (p >= 1) { state = 'finished'; pausedProgress = 1; return 1; }
      return Math.max(0, p);
    },
  };
}

module.exports = { createAnimationController };`;
