import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createChatRoom = getExport<(url: string, opts?: {
      wsFactory?: (url: string) => unknown;
    }) => {
      connect(): void; disconnect(): void; send(m: string): void;
      onMessage(cb: (m: string) => void): void; getState(): string;
    }>(exports, 'createChatRoom');

    const sentMessages: string[] = [];
    let openCb: (() => void) | null = null;
    let msgCb: ((e: { data: string }) => void) | null = null;

    // Use a plain object with writable properties to avoid TS setter issues
    const mockWs: Record<string, unknown> = {
      send: (m: string) => sentMessages.push(m),
      close: () => {},
      onopen: null,
      onmessage: null,
      onerror: null,
      onclose: null,
    };

    const room = createChatRoom('ws://test', {
      wsFactory: () => {
        const ws = new Proxy(mockWs, {
          set(target, key, value) {
            target[key as string] = value;
            if (key === 'onopen') openCb = value as () => void;
            if (key === 'onmessage') msgCb = value as (e: { data: string }) => void;
            return true;
          },
        }) as unknown as WebSocket;
        return ws;
      },
    });

    const test1 = room.getState() === 'disconnected';

    room.connect();
    const test2 = room.getState() === 'connecting';

    room.send('queued message');
    const test3 = sentMessages.length === 0;

    const ocb = openCb as (() => void) | null;
    if (ocb) ocb();
    const test4 = room.getState() === 'connected' && sentMessages.includes('queued message');

    const received: string[] = [];
    room.onMessage((m: string) => received.push(m));
    const mcb = msgCb as ((e: { data: string }) => void) | null;
    if (mcb) mcb({ data: 'hello from server' });
    const test5 = received[0] === 'hello from server';

    return {
      passed: test1 && test2 && test3 && test4 && test5,
      results: [
        { description: 'Initial state is disconnected', expected: 'disconnected', actual: test1 ? 'disconnected' : 'wrong', passed: test1 },
        { description: 'After connect(), state is connecting', expected: 'connecting', actual: test2 ? 'connecting' : 'wrong', passed: test2 },
        { description: 'Messages queued before connected', expected: 'sent=0', actual: `sent=${sentMessages.length - (test4 ? 1 : 0)}`, passed: test3 },
        { description: 'Queued messages flushed on connect', expected: 'connected + queued sent', actual: `state=${room.getState()}, sent=${sentMessages.length}`, passed: test4 },
        { description: 'onMessage listener receives incoming messages', expected: '"hello from server"', actual: received[0] ?? 'none', passed: test5 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
