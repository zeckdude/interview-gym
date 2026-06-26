import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const getConfig = getExport<
      (env: Record<string, string | undefined>) => {
        databaseUrl: string;
        apiKey: string;
        port: number;
      }
    >(exports, 'getConfig');

    const validEnv = {
      DATABASE_URL: 'postgres://localhost/db',
      API_KEY: 'secret-key',
      PORT: '3000',
    };

    const result = getConfig(validEnv);
    const validPassed =
      result.databaseUrl === validEnv.DATABASE_URL &&
      result.apiKey === validEnv.API_KEY &&
      result.port === 3000;

    let errorMessage = '';
    try {
      getConfig({ DATABASE_URL: 'postgres://localhost/db' });
    } catch (e: unknown) {
      errorMessage = String(e);
    }

    const errorPassed = errorMessage.includes('Missing required env variable: API_KEY');

    return {
      passed: validPassed && errorPassed,
      results: [
        {
          description: 'Returns correct config for valid env',
          expected: '{ databaseUrl, apiKey, port: 3000 }',
          actual: JSON.stringify(result),
          passed: validPassed,
        },
        {
          description: 'Throws descriptive error for missing API_KEY',
          expected: 'Missing required env variable: API_KEY',
          actual: errorMessage,
          passed: errorPassed,
        },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
