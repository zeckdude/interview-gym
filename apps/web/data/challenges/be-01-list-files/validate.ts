import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult, makeFsRequire } from '../_utils';

export async function validate(userCode: string) {
  const mockFiles = ['index.js', 'package.json', 'README.md', 'server.js'];
  const mockFs = {
    readdirSync: (_path: string) => mockFiles,
    promises: {
      readdir: (_path: string) => Promise.resolve(mockFiles),
    },
  };
  try {
    const exports = executeUserCode(userCode, makeFsRequire(mockFs));
    const listFiles = getExport<() => string | Promise<string>>(exports, 'listFiles');
    const result = await listFiles();
    const expected = 'index.js, package.json, README.md, server.js';
    return {
      passed: result === expected,
      results: [
        {
          description: 'Returns comma-separated filename string',
          expected,
          actual: String(result),
          passed: result === expected,
        },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
