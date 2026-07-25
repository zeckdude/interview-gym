import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const validateForm = getExport<
      (values: Record<string, string>, rules: Record<string, unknown>) => { valid: boolean; errors: Record<string, string[]> }
    >(exports, 'validateForm');

    // Test 1: valid form
    const r1 = validateForm(
      { name: 'Alice', email: 'alice@test.com' },
      { name: { required: true }, email: { required: true } }
    );
    const test1 = r1.valid === true;

    // Test 2: required field missing
    const r2 = validateForm(
      { email: '' },
      { email: { required: true } }
    );
    const test2 = r2.valid === false && r2.errors.email?.length > 0;

    // Test 3: minLength
    const r3 = validateForm(
      { password: 'abc' },
      { password: { minLength: 8 } }
    );
    const test3 = r3.valid === false && r3.errors.password?.length > 0;

    // Test 4: custom validator
    const r4 = validateForm(
      { username: 'admin' },
      { username: { custom: (v: string) => v === 'admin' ? 'username is reserved' : null } }
    );
    const test4 = r4.valid === false && r4.errors.username?.some((e: string) => e.includes('reserved'));

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'Valid form returns { valid: true }', expected: 'valid=true', actual: `valid=${r1.valid}`, passed: test1 },
        { description: 'Required field missing returns error', expected: 'email has errors', actual: `email errors: ${r2.errors.email?.length ?? 0}`, passed: test2 },
        { description: 'minLength rule fires for short values', expected: 'password has errors', actual: `password errors: ${r3.errors.password?.length ?? 0}`, passed: test3 },
        { description: 'Custom validator message is included', expected: 'reserved error', actual: r4.errors.username?.join(', ') ?? 'none', passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
