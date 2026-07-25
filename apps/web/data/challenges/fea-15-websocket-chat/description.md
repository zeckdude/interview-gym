# WebSocket Chat

## What You're Building

Implement `createChatRoom` — a WebSocket-backed chat room manager. The focus is on message handling, connection state management, and reconnection logic.

## Requirements

- `createChatRoom(url, options?)` returns `{ send(msg), onMessage(cb), connect(), disconnect(), getState() }`
- State machine: `'disconnected' | 'connecting' | 'connected' | 'error'`
- Messages sent while not connected are queued and flushed on connect
- `onMessage(cb)` registers a listener (multiple allowed)
- `disconnect()` stops reconnection attempts
- Accepts a mock WebSocket factory for testing

## Example

```js
const room = createChatRoom('ws://localhost:3001', { wsFactory: MockWebSocket });
room.connect();
room.send('Hello'); // queued until connected
// ...connected...
// 'Hello' is sent
room.getState(); // 'connected'
```

## Why This Comes Up in Interviews

Real-time features (chat, notifications, live data) are essential in modern apps. This tests your ability to manage state machines, handle async connections, and implement message queuing — all critical for production-quality real-time systems.

## What You Need to Know

- WebSocket API: `new WebSocket(url)`, `onopen`, `onmessage`, `onclose`, `onerror`
- Message queuing pattern
- State machine for connection lifecycle
- Reconnection strategies (exponential backoff)
