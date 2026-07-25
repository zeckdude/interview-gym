export const starterTs = `class LRUCache {
  private capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    // Initialize your data structures here
  }

  get(key: number): number {
    // Return the value or -1 if not found
    return -1;
  }

  put(key: number, value: number): void {
    // Insert or update, evicting LRU if at capacity
  }
}

export { LRUCache };`;

export const starterJs = `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    // Initialize your data structures here
  }

  get(key) {
    // Return the value or -1 if not found
    return -1;
  }

  put(key, value) {
    // Insert or update, evicting LRU if at capacity
  }
}

module.exports = { LRUCache };`;

export const solutionTs = `class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) {
      const lruKey = this.cache.keys().next().value;
      this.cache.delete(lruKey);
    }
    this.cache.set(key, value);
  }
}

export { LRUCache };`;

export const solutionJs = `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const lruKey = this.cache.keys().next().value;
      this.cache.delete(lruKey);
    }
    this.cache.set(key, value);
  }
}

module.exports = { LRUCache };`;
