import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  const files: Record<string, string> = {
    'input.txt': 'hello from interview gym',
  };
  const mockFs = {
    readFileSync: (path: string, _encoding?: string) => {
      if (!(path in files)) throw new Error(`ENOENT: no such file ${path}`);
      return files[path];
    },
    writeFileSync: (path: string, data: string) => {
      files[path] = data;
    },
  };
  try {
    const exports = executeUserCode(userCode, (mod: string) =>
      mod === 'fs' ? mockFs : {}
    );
    const readAndWrite = getExport<() => string>(exports, 'readAndWrite');
    const result = readAndWrite();
    const expected = 'HELLO FROM INTERVIEW GYM';
    const fileWritten = files['output.txt'] === expected;
    const returnCorrect = result === expected;
    return {
      passed: returnCorrect && fileWritten,
      results: [
        {
          description: 'Returns uppercase string',
          expected,
          actual: String(result),
          passed: returnCorrect,
        },
        {
          description: 'Writes correct content to output.txt',
          expected,
          actual: files['output.txt'] ?? '(not written)',
          passed: fileWritten,
        },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
