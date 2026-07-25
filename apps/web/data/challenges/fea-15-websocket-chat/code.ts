export const starterTs = `type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

interface ChatRoomOptions {
  wsFactory?: (url: string) => WebSocket;
}

function createChatRoom(url: string, options: ChatRoomOptions = {}) {
  // Implement WebSocket chat room manager

  return {
    connect(): void {},
    disconnect(): void {},
    send(_message: string): void {},
    onMessage(_cb: (msg: string) => void): void {},
    getState(): ConnectionState { return 'disconnected'; },
  };
}

export { createChatRoom };`;

export const starterJs = `function createChatRoom(url, options = {}) {
  // Implement WebSocket chat room manager

  return {
    connect() {},
    disconnect() {},
    send(message) {},
    onMessage(cb) {},
    getState() { return 'disconnected'; },
  };
}

module.exports = { createChatRoom };`;

export const solutionTs = `type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

function createChatRoom(url: string, options: { wsFactory?: (url: string) => WebSocket } = {}) {
  let state: ConnectionState = 'disconnected';
  const queue: string[] = [];
  const listeners: Array<(msg: string) => void> = [];
  let ws: WebSocket | null = null;
  let active = true;

  const factory = options.wsFactory ?? ((u: string) => new WebSocket(u));

  function flushQueue() {
    while (queue.length) ws?.send(queue.shift()!);
  }

  return {
    connect(): void {
      if (state === 'connected' || state === 'connecting') return;
      state = 'connecting';
      ws = factory(url);
      ws.onopen = () => { state = 'connected'; flushQueue(); };
      ws.onmessage = (e) => listeners.forEach(cb => cb(e.data as string));
      ws.onerror = () => { state = 'error'; };
      ws.onclose = () => { if (active) state = 'disconnected'; };
    },
    disconnect(): void {
      active = false;
      ws?.close();
      state = 'disconnected';
    },
    send(message: string): void {
      if (state === 'connected') { ws?.send(message); }
      else { queue.push(message); }
    },
    onMessage(cb: (msg: string) => void): void { listeners.push(cb); },
    getState(): ConnectionState { return state; },
  };
}

export { createChatRoom };`;

export const solutionJs = `function createChatRoom(url, options = {}) {
  let state = 'disconnected';
  const queue = [];
  const listeners = [];
  let ws = null;
  let active = true;

  const factory = options.wsFactory ?? ((u) => new WebSocket(u));

  function flushQueue() {
    while (queue.length) ws?.send(queue.shift());
  }

  return {
    connect() {
      if (state === 'connected' || state === 'connecting') return;
      state = 'connecting';
      ws = factory(url);
      ws.onopen = () => { state = 'connected'; flushQueue(); };
      ws.onmessage = (e) => listeners.forEach(cb => cb(e.data));
      ws.onerror = () => { state = 'error'; };
      ws.onclose = () => { if (active) state = 'disconnected'; };
    },
    disconnect() {
      active = false;
      ws?.close();
      state = 'disconnected';
    },
    send(message) {
      if (state === 'connected') ws?.send(message);
      else queue.push(message);
    },
    onMessage(cb) { listeners.push(cb); },
    getState() { return state; },
  };
}

module.exports = { createChatRoom };`;
