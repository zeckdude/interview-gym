export const starterTs = `function serialize(data: unknown): string {
  // JSON-serialize data safely for embedding in <script> tags
  return JSON.stringify(data);
}

function deserialize<T>(raw: string): T {
  return JSON.parse(raw) as T;
}

function createHydrationManager() {
  // Implement server→client data handoff

  return {
    inject(_key: string, _data: unknown): void {},
    extract<T>(_key: string): T | null { return null; },
    getAll(): Record<string, unknown> { return {}; },
  };
}

export { serialize, deserialize, createHydrationManager };`;

export const starterJs = `function serialize(data) {
  return JSON.stringify(data);
}

function deserialize(raw) {
  return JSON.parse(raw);
}

function createHydrationManager() {
  // Implement server→client data handoff

  return {
    inject(key, data) {},
    extract(key) { return null; },
    getAll() { return {}; },
  };
}

module.exports = { serialize, deserialize, createHydrationManager };`;

export const solutionTs = `function serialize(data: unknown): string {
  return JSON.stringify(data).replace(/<\\/script>/gi, '<\\/script>');
}

function deserialize<T>(raw: string): T {
  return JSON.parse(raw.replace(/<\\/script>/gi, '</script>')) as T;
}

function createHydrationManager() {
  const store = new Map<string, string>();

  return {
    inject(key: string, data: unknown): void {
      store.set(key, serialize(data));
    },
    extract<T>(key: string): T | null {
      const raw = store.get(key);
      return raw ? deserialize<T>(raw) : null;
    },
    getAll(): Record<string, unknown> {
      const result: Record<string, unknown> = {};
      store.forEach((raw, key) => { result[key] = deserialize(raw); });
      return result;
    },
  };
}

export { serialize, deserialize, createHydrationManager };`;

export const solutionJs = `function serialize(data) {
  return JSON.stringify(data).replace(/<\\/script>/gi, '<\\/script>');
}

function deserialize(raw) {
  return JSON.parse(raw.replace(/<\\/script>/gi, '</script>'));
}

function createHydrationManager() {
  const store = new Map();

  return {
    inject(key, data) { store.set(key, serialize(data)); },
    extract(key) {
      const raw = store.get(key);
      return raw ? deserialize(raw) : null;
    },
    getAll() {
      const result = {};
      store.forEach((raw, key) => { result[key] = deserialize(raw); });
      return result;
    },
  };
}

module.exports = { serialize, deserialize, createHydrationManager };`;
