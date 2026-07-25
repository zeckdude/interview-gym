export const starterTs = `type Listener = (...args: unknown[]) => void;

class EventEmitter {
  // Your implementation here

  on(event: string, listener: Listener): this {
    return this;
  }

  off(event: string, listener: Listener): this {
    return this;
  }

  emit(event: string, ...args: unknown[]): void {
    
  }

  once(event: string, listener: Listener): this {
    return this;
  }
}

export { EventEmitter };`;

export const starterJs = `class EventEmitter {
  // Your implementation here

  on(event, listener) {
    return this;
  }

  off(event, listener) {
    return this;
  }

  emit(event, ...args) {
    
  }

  once(event, listener) {
    return this;
  }
}

module.exports = { EventEmitter };`;

export const solutionTs = `type Listener = (...args: unknown[]) => void;

class EventEmitter {
  private events = new Map<string, Listener[]>();

  on(event: string, listener: Listener): this {
    if (!this.events.has(event)) this.events.set(event, []);
    this.events.get(event)!.push(listener);
    return this;
  }

  off(event: string, listener: Listener): this {
    const listeners = this.events.get(event);
    if (listeners) {
      this.events.set(event, listeners.filter((l) => l !== listener));
    }
    return this;
  }

  emit(event: string, ...args: unknown[]): void {
    const listeners = this.events.get(event);
    if (listeners) {
      [...listeners].forEach((l) => l(...args));
    }
  }

  once(event: string, listener: Listener): this {
    const wrapper: Listener = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }
}

export { EventEmitter };`;

export const solutionJs = `class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) this.events.set(event, []);
    this.events.get(event).push(listener);
    return this;
  }

  off(event, listener) {
    const listeners = this.events.get(event);
    if (listeners) {
      this.events.set(event, listeners.filter((l) => l !== listener));
    }
    return this;
  }

  emit(event, ...args) {
    const listeners = this.events.get(event);
    if (listeners) {
      [...listeners].forEach((l) => l(...args));
    }
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }
}

module.exports = { EventEmitter };`;
