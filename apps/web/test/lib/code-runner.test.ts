import { describe, expect, it } from 'vitest';
import { prepareCodeForExecution } from '@/lib/code-runner';

describe('prepareCodeForExecution', () => {
  it('returns javascript unchanged', () => {
    const code = 'function foo() { return 1; }';
    expect(prepareCodeForExecution(code, 'javascript')).toBe(code);
  });

  it('strips TypeScript interfaces and type aliases', () => {
    const code = `
interface Foo { x: number; }
type Bar = string;
export function greet(name: string): string {
  return name;
}
`;
    const result = prepareCodeForExecution(code, 'typescript');
    expect(result).not.toMatch(/\binterface\b/);
    expect(result).not.toMatch(/\btype Bar\b/);
    expect(result).toContain('function greet');
  });

  it('converts ES module exports to CommonJS', () => {
    const code = `export function list() { return 1; }`;
    const result = prepareCodeForExecution(code, 'typescript');
    expect(result).toMatch(/exports\.list|module\.exports/);
    expect(result).toContain('function list');
  });

  it('strips type annotations from parameters', () => {
    const code = `function add(a: number, b: number): number { return a + b; }`;
    const result = prepareCodeForExecution(code, 'typescript');
    expect(result).not.toContain(': number');
    expect(result).toContain('function add');
  });

  it('preserves comparison operators that look like generics', () => {
    const code = `export function cmp(a: number, b: number): boolean { return a < b && b > a; }`;
    const result = prepareCodeForExecution(code, 'typescript');
    expect(result).toContain('a < b');
  });
});

