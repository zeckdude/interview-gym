import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  const mockFiles = ['index.js', 'package.json', 'README.md', 'server.js'];
  const mockFs = {
    readdirSync: (_path: string) => mockFiles,
  };
  try {
    const exports = executeUserCode(userCode, (mod: string) =>
      mod === 'fs' ? mockFs : {}
    );
    const listFiles = getExport<() => string>(exports, 'listFiles');
    const result = listFiles();
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
