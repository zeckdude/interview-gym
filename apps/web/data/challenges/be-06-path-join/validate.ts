import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const pathJoin = getExport<(...segments: string[]) => string>(exports, 'pathJoin');

    const cases = [
      {
        args: ['users', 'admin', 'profile'],
        expected: 'users/admin/profile',
        description: 'Joins basic segments',
      },
      {
        args: ['/api/', '/v1/', '/users'],
        expected: '/api/v1/users',
        description: 'Normalizes multiple leading slashes',
      },
      {
        args: ['a', '', 'b', 'c'],
        expected: 'a/b/c',
        description: 'Ignores empty segments',
      },
      {
        args: ['/root/', 'dir', ''],
        expected: '/root/dir',
        description: 'Removes trailing slash',
      },
    ];

    const results = cases.map(({ args, expected, description }) => {
      const actual = pathJoin(...args);
      const passed = actual === expected;
      return { description, expected, actual: String(actual), passed };
    });

    return { passed: results.every((r) => r.passed), results };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
