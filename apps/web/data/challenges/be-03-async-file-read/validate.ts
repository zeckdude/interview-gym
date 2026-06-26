import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export async function validate(userCode: string) {
  const files: Record<string, string> = {
    'data.txt': 'async content here',
  };
  const mockFs = {
    promises: {
      readFile: async (path: string, _encoding?: string) => {
        if (!(path in files)) {
          const err = new Error('ENOENT') as Error & { code: string };
          err.code = 'ENOENT';
          throw err;
        }
        return files[path];
      },
    },
  };
  try {
    const exports = executeUserCode(userCode, (mod: string) =>
      mod === 'fs' ? mockFs : {}
    );
    const readFileAsync = getExport<(filename: string) => Promise<string>>(
      exports,
      'readFileAsync'
    );

    const existing = await readFileAsync('data.txt');
    const missing = await readFileAsync('missing.txt');
    const expectedExisting = 'async content here';
    const expectedMissing = 'file not found';
    return {
      passed: existing === expectedExisting && missing === expectedMissing,
      results: [
        {
          description: 'Reads existing file contents',
          expected: expectedExisting,
          actual: existing,
          passed: existing === expectedExisting,
        },
        {
          description: 'Returns "file not found" for missing file',
          expected: expectedMissing,
          actual: missing,
          passed: missing === expectedMissing,
        },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
