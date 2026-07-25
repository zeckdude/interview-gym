export const starterTs = `const FOCUSABLE = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

function createFocusTrap(container: Element) {
  // Implement focus trap logic here

  return {
    activate() {},
    deactivate() {},
  };
}

export { createFocusTrap };`;

export const starterJs = `const FOCUSABLE = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

function createFocusTrap(container) {
  // Implement focus trap logic here

  return {
    activate() {},
    deactivate() {},
  };
}

module.exports = { createFocusTrap };`;

export const solutionTs = `const FOCUSABLE = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

function createFocusTrap(container: Element) {
  let previousFocus: Element | null = null;
  let handleKeyDown: ((e: KeyboardEvent) => void) | null = null;

  return {
    activate() {
      previousFocus = document.activeElement;
      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
      focusable[0]?.focus();

      handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        const elements = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (!elements.length) { e.preventDefault(); return; }
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
    },
    deactivate() {
      if (handleKeyDown) document.removeEventListener('keydown', handleKeyDown);
      (previousFocus as HTMLElement)?.focus?.();
    },
  };
}

export { createFocusTrap };`;

export const solutionJs = `const FOCUSABLE = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

function createFocusTrap(container) {
  let previousFocus = null;
  let handleKeyDown = null;

  return {
    activate() {
      previousFocus = document.activeElement;
      const focusable = Array.from(container.querySelectorAll(FOCUSABLE));
      focusable[0]?.focus();

      handleKeyDown = (e) => {
        if (e.key !== 'Tab') return;
        const elements = Array.from(container.querySelectorAll(FOCUSABLE));
        if (!elements.length) { e.preventDefault(); return; }
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
    },
    deactivate() {
      if (handleKeyDown) document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus?.();
    },
  };
}

module.exports = { createFocusTrap };`;
