import { describe, expect, it } from 'vitest';
import {
  combineLearnCode,
  extractUserCodeFromStored,
  findErrorLineInCode,
  mapFullCodeLineToUserLine,
} from '@/lib/learn/code-error-line';
import { runLearnCode } from '@/lib/learn/execute-code';

describe('combineLearnCode', () => {
  it('joins setup and user regions', () => {
    expect(combineLearnCode('// setup', "console.log('hi');")).toBe(
      "// setup\nconsole.log('hi');"
    );
  });

  it('returns user code when setup is empty', () => {
    expect(combineLearnCode('', "console.log('hi');")).toBe("console.log('hi');");
  });
});

describe('extractUserCodeFromStored', () => {
  it('strips setup prefix from persisted full code', () => {
    const stored = "// setup\nconsole.log('');";
    expect(extractUserCodeFromStored(stored, '// setup', "console.log('');")).toBe(
      "console.log('');"
    );
  });
});

describe('findErrorLineInCode', () => {
  it('finds undefined variable usage', () => {
    const code = "const x = 1;\nconsole.log(missing);";
    expect(findErrorLineInCode(code, 'ReferenceError: missing is not defined')).toBe(2);
  });

  it('ignores identifier mentions inside setup comments', () => {
    const code = "// Declare missing, then log it:\nconsole.log(missing);";
    expect(findErrorLineInCode(code, 'ReferenceError: missing is not defined')).toBe(2);
  });

  it('highlights incomplete const declaration for syntax errors', () => {
    const code = "// Declare name, then log it:\nconst name\nconsole.log(name);";
    expect(
      findErrorLineInCode(code, 'SyntaxError: Missing initializer in const declaration')
    ).toBe(2);
  });
});

describe('mapFullCodeLineToUserLine', () => {
  it('maps full-code lines into the editable region', () => {
    expect(mapFullCodeLineToUserLine(3, 1)).toBe(2);
    expect(mapFullCodeLineToUserLine(1, 2)).toBeNull();
  });
});

describe('runLearnCode errorLine', () => {
  it('returns a line number for reference errors', () => {
    const result = runLearnCode(`console.log(missing);`);
    expect(result.ok).toBe(false);
    expect(result.errorLine).toBe(1);
  });

  it('returns user line when setup comment mentions the same identifier', () => {
    const result = runLearnCode(
      "// Declare missing, then log it:\nconsole.log(missing);"
    );
    expect(result.ok).toBe(false);
    expect(result.errorLine).toBe(2);
  });

  it('points syntax errors at incomplete const declarations', () => {
    const result = runLearnCode("// setup\nconst name\nconsole.log(name);");
    expect(result.ok).toBe(false);
    expect(result.error).toContain('Missing initializer');
    expect(result.errorLine).toBe(2);
  });
});
