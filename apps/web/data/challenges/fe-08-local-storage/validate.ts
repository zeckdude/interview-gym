import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    // Mock localStorage
    const store: Record<string, string> = {};
    const mockLocalStorage = {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => { store[k] = v; },
      removeItem: (k: string) => { delete store[k]; },
    };

    const wrappedCode = `const localStorage = ${JSON.stringify(mockLocalStorage)};\n${userCode}`
      .replace(
        `const localStorage = ${JSON.stringify(mockLocalStorage)};`,
        `const localStorage = { getItem: (k) => (${JSON.stringify(store)})[k] ?? null, setItem: (k, v) => { (${JSON.stringify(store)})[k] = v; }, removeItem: (k) => { delete (${JSON.stringify(store)})[k]; } };`
      );

    // Use a simpler approach: inject mockLocalStorage directly
    const requireFn = () => ({});
    const codeWithMock = `
const _store = {};
const localStorage = {
  getItem(k) { return Object.prototype.hasOwnProperty.call(_store, k) ? _store[k] : null; },
  setItem(k, v) { _store[k] = String(v); },
  removeItem(k) { delete _store[k]; },
};
${userCode}`;

    const exports = executeUserCode(codeWithMock, requireFn);
    const createStorage = getExport<<T>(key: string, def: T) => { get(): T; set(v: T): void; remove(): void }>(
      exports,
      'createStorage'
    );

    // Test 1: returns default when not set
    const s1 = createStorage('test', { theme: 'light' });
    const r1 = s1.get();
    const test1 = r1 !== null && typeof r1 === 'object' && (r1 as Record<string, string>).theme === 'light';

    // Test 2: set and get
    s1.set({ theme: 'dark' });
    const r2 = s1.get();
    const test2 = (r2 as Record<string, string>).theme === 'dark';

    // Test 3: remove returns default
    s1.remove();
    const r3 = s1.get();
    const test3 = (r3 as Record<string, string>).theme === 'light';

    // Test 4: works with primitives
    const s2 = createStorage('count', 0);
    s2.set(42);
    const r4 = s2.get();
    const test4 = r4 === 42;

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'Returns defaultValue when key not set', expected: '{ theme: "light" }', actual: JSON.stringify(r1), passed: test1 },
        { description: 'set() persists value, get() retrieves it', expected: '{ theme: "dark" }', actual: JSON.stringify(r2), passed: test2 },
        { description: 'remove() clears key, get() returns default', expected: '{ theme: "light" }', actual: JSON.stringify(r3), passed: test3 },
        { description: 'Works with number values', expected: '42', actual: String(r4), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
