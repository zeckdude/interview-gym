export const starterTs = `interface InputRef {
  focus(): void;
  blur(): void;
  isFocused(): boolean;
}

interface InputOptions {
  placeholder?: string;
  defaultValue?: string;
}

function createRefableInput(options: InputOptions = {}) {
  // Implement forwardRef-like input pattern

  return {
    getValue(): string { return options.defaultValue ?? ''; },
    setValue(_value: string): void {},
    getRef(): InputRef {
      return {
        focus() {},
        blur() {},
        isFocused() { return false; },
      };
    },
  };
}

export { createRefableInput };`;

export const starterJs = `function createRefableInput(options = {}) {
  // Implement forwardRef-like input pattern

  return {
    getValue() { return options.defaultValue ?? ''; },
    setValue(value) {},
    getRef() {
      return {
        focus() {},
        blur() {},
        isFocused() { return false; },
      };
    },
  };
}

module.exports = { createRefableInput };`;

export const solutionTs = `interface InputRef {
  focus(): void;
  blur(): void;
  isFocused(): boolean;
}

function createRefableInput(options: { placeholder?: string; defaultValue?: string } = {}) {
  let value = options.defaultValue ?? '';
  let focused = false;

  const ref: InputRef = {
    focus() { focused = true; },
    blur() { focused = false; },
    isFocused() { return focused; },
  };

  return {
    getValue() { return value; },
    setValue(v: string) { value = v; },
    getRef() { return ref; },
  };
}

export { createRefableInput };`;

export const solutionJs = `function createRefableInput(options = {}) {
  let value = options.defaultValue ?? '';
  let focused = false;

  const ref = {
    focus() { focused = true; },
    blur() { focused = false; },
    isFocused() { return focused; },
  };

  return {
    getValue() { return value; },
    setValue(v) { value = v; },
    getRef() { return ref; },
  };
}

module.exports = { createRefableInput };`;
