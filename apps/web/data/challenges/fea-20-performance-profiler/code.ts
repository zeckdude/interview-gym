export const starterTs = `interface Measurement {
  label: string;
  duration: number;
  startTime: number;
  endTime: number;
}

interface Summary {
  label: string;
  count: number;
  totalMs: number;
  avgMs: number;
  minMs: number;
  maxMs: number;
}

function createProfiler(_name: string, options: { clock?: { now(): number } } = {}) {
  // Implement performance profiler

  return {
    start(_label: string): void {},
    end(_label: string): void {},
    getMeasurements(): Measurement[] { return []; },
    getSummary(): Summary[] { return []; },
  };
}

export { createProfiler };`;

export const starterJs = `function createProfiler(name, options = {}) {
  // Implement performance profiler

  return {
    start(label) {},
    end(label) {},
    getMeasurements() { return []; },
    getSummary() { return []; },
  };
}

module.exports = { createProfiler };`;

export const solutionTs = `interface Measurement {
  label: string;
  duration: number;
  startTime: number;
  endTime: number;
}

function createProfiler(_name: string, options: { clock?: { now(): number } } = {}) {
  const clock = options.clock ?? { now: () => performance.now() };
  const starts = new Map<string, number>();
  const measurements: Measurement[] = [];

  return {
    start(label: string): void {
      starts.set(label, clock.now());
    },
    end(label: string): void {
      const s = starts.get(label);
      if (s === undefined) return;
      const endTime = clock.now();
      measurements.push({ label, startTime: s, endTime, duration: endTime - s });
      starts.delete(label);
    },
    getMeasurements(): Measurement[] { return [...measurements]; },
    getSummary() {
      const grouped = new Map<string, number[]>();
      for (const m of measurements) {
        if (!grouped.has(m.label)) grouped.set(m.label, []);
        grouped.get(m.label)!.push(m.duration);
      }
      return Array.from(grouped.entries()).map(([label, durations]) => ({
        label,
        count: durations.length,
        totalMs: durations.reduce((a, b) => a + b, 0),
        avgMs: durations.reduce((a, b) => a + b, 0) / durations.length,
        minMs: Math.min(...durations),
        maxMs: Math.max(...durations),
      }));
    },
  };
}

export { createProfiler };`;

export const solutionJs = `function createProfiler(name, options = {}) {
  const clock = options.clock ?? { now: () => performance.now() };
  const starts = new Map();
  const measurements = [];

  return {
    start(label) { starts.set(label, clock.now()); },
    end(label) {
      const s = starts.get(label);
      if (s === undefined) return;
      const endTime = clock.now();
      measurements.push({ label, startTime: s, endTime, duration: endTime - s });
      starts.delete(label);
    },
    getMeasurements() { return [...measurements]; },
    getSummary() {
      const grouped = new Map();
      for (const m of measurements) {
        if (!grouped.has(m.label)) grouped.set(m.label, []);
        grouped.get(m.label).push(m.duration);
      }
      return Array.from(grouped.entries()).map(([label, durations]) => ({
        label,
        count: durations.length,
        totalMs: durations.reduce((a, b) => a + b, 0),
        avgMs: durations.reduce((a, b) => a + b, 0) / durations.length,
        minMs: Math.min(...durations),
        maxMs: Math.max(...durations),
      }));
    },
  };
}

module.exports = { createProfiler };`;
