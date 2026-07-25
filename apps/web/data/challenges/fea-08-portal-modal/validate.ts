import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createModalManager = getExport<<T>() => {
      open(c: T): void; close(): void; isOpen(): boolean; getContent(): T | null;
    }>(exports, 'createModalManager');

    const modal = createModalManager<string>();
    const test1 = !modal.isOpen() && modal.getContent() === null;

    modal.open('Are you sure?');
    const test2 = modal.isOpen() && modal.getContent() === 'Are you sure?';

    modal.close();
    const test3 = !modal.isOpen() && modal.getContent() === null;

    modal.open('First');
    modal.open('Second');
    const test4 = modal.isOpen() && modal.getContent() === 'Second';

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'Initially closed with null content', expected: 'closed, null', actual: `open=${modal.isOpen()}, content=${modal.getContent()}`, passed: test1 },
        { description: 'open() sets open=true and content', expected: 'open, "Are you sure?"', actual: `${test2 ? 'ok' : 'fail'}`, passed: test2 },
        { description: 'close() sets open=false and content=null', expected: 'closed, null', actual: `${test3 ? 'ok' : 'fail'}`, passed: test3 },
        { description: 'Opening over existing modal replaces content', expected: '"Second"', actual: String(modal.getContent()), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
