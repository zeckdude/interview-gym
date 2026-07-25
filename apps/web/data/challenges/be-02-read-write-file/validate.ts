import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult, makeFsRequire } from '../_utils';

export async function validate(userCode: string) {
  const files: Record<string, string> = {
    'input.txt': 'hello from interview gym',
  };
  const mockFs = {
    readFileSync: (path: string, _encoding?: string) => {
      if (!(path in files)) throw new Error(`ENOENT: no such file or directory, open '${path}'`);
      return files[path];
    },
    writeFileSync: (path: string, data: string) => {
      files[path] = data;
    },
    promises: {
      readFile: async (path: string, _encoding?: string) => {
        if (!(path in files)) throw new Error(`ENOENT: no such file or directory, open '${path}'`);
        return files[path];
      },
      writeFile: async (path: string, data: string) => {
        files[path] = data;
      },
    },
  };
  try {
    const exports = executeUserCode(userCode, makeFsRequire(mockFs));
    const readAndWrite = getExport<() => string | Promise<string>>(exports, 'readAndWrite');
    const result = await readAndWrite();
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
