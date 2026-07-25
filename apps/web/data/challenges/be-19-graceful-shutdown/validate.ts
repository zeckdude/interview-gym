import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface ShutdownManager {
  onShutdown(handler: (reason?: string) => Promise<void>): void;
  shutdown(reason?: string): Promise<void>;
}

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createShutdownManager = getExport<() => ShutdownManager>(exports, 'createShutdownManager');

    // Test 1: handlers run in order
    const m1 = createShutdownManager();
    const order: number[] = [];
    m1.onShutdown(async () => { order.push(1); });
    m1.onShutdown(async () => { order.push(2); });
    m1.onShutdown(async () => { order.push(3); });
    await m1.shutdown();
    const test1 = JSON.stringify(order) === '[1,2,3]';

    // Test 2: reason is passed to handlers
    const m2 = createShutdownManager();
    let receivedReason = '';
    m2.onShutdown(async (reason) => { receivedReason = reason ?? ''; });
    await m2.shutdown('SIGTERM');
    const test2 = receivedReason === 'SIGTERM';

    // Test 3: shutdown is idempotent
    const m3 = createShutdownManager();
    let count = 0;
    m3.onShutdown(async () => { count++; });
    await m3.shutdown();
    await m3.shutdown();
    await m3.shutdown();
    const test3 = count === 1;

    return {
      passed: test1 && test2 && test3,
      results: [
        { description: 'Handlers run in registration order', expected: '[1,2,3]', actual: JSON.stringify(order), passed: test1 },
        { description: 'Reason string passed to each handler', expected: 'SIGTERM', actual: receivedReason, passed: test2 },
        { description: 'Multiple shutdown() calls are idempotent', expected: '1 run', actual: `${count} run(s)`, passed: test3 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
