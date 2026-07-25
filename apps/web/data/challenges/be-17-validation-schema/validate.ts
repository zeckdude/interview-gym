import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createSchema = getExport<
      (def: Record<string, { type: string; required?: boolean }>) => {
        validate(data: Record<string, unknown>): ValidationResult;
      }
    >(exports, 'createSchema');

    const schema = createSchema({
      name: { type: 'string', required: true },
      age: { type: 'number', required: true },
      active: { type: 'boolean' },
    });

    // Test 1: valid data
    const r1 = schema.validate({ name: 'Alice', age: 30 });
    const test1 = r1.valid === true && r1.errors.length === 0;

    // Test 2: wrong type
    const r2 = schema.validate({ name: 'Bob', age: 'old' });
    const test2 = r2.valid === false && r2.errors.some((e) => e.includes('age'));

    // Test 3: missing required
    const r3 = schema.validate({});
    const test3 = r3.valid === false && r3.errors.length >= 2;

    // Test 4: optional field ok to omit
    const r4 = schema.validate({ name: 'Carol', age: 25 });
    const test4 = r4.valid === true;

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'Valid data passes', expected: '{ valid: true }', actual: JSON.stringify(r1), passed: test1 },
        { description: 'Wrong type fails with error mentioning field', expected: 'age error', actual: JSON.stringify(r2.errors), passed: test2 },
        { description: 'Missing required fields fail', expected: '≥2 errors', actual: `${r3.errors.length} errors`, passed: test3 },
        { description: 'Optional field can be omitted', expected: '{ valid: true }', actual: JSON.stringify(r4), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
