import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createRefableInput = getExport<
      (opts?: { defaultValue?: string }) => {
        getValue(): string;
        setValue(v: string): void;
        getRef(): { focus(): void; blur(): void; isFocused(): boolean };
      }
    >(exports, 'createRefableInput');

    const input = createRefableInput({ defaultValue: 'hello' });
    const test1 = input.getValue() === 'hello';

    input.setValue('world');
    const test2 = input.getValue() === 'world';

    const ref = input.getRef();
    ref.focus();
    const test3 = ref.isFocused() === true;

    ref.blur();
    const test4 = ref.isFocused() === false;

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'getValue() returns defaultValue', expected: 'hello', actual: input.getValue(), passed: test1 },
        { description: 'setValue() updates the value', expected: 'world', actual: input.getValue(), passed: test2 },
        { description: 'ref.focus() marks input as focused', expected: 'isFocused=true', actual: String(ref.isFocused()), passed: test3 },
        { description: 'ref.blur() marks input as unfocused', expected: 'isFocused=false', actual: String(ref.isFocused()), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
