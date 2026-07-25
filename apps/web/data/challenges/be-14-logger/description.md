# Structured Logger

## What You're Building

Implement a `createLogger` function that returns a structured logging object with leveled output — like a minimal version of `pino` or `winston`.

## Requirements

- `createLogger(options?)` returns a logger with `log`, `warn`, `error`, and `debug` methods
- Each method accepts a message and optional metadata object
- Each log entry is an object: `{ level, message, timestamp, ...metadata }`
- Logger has a `getEntries()` method returning all captured log entries
- `options.level` filters: `'error'` only logs errors; `'warn'` logs warn + error; `'log'` logs all
- Default level is `'log'` (all levels)

## Example

```js
const logger = createLogger();
logger.log('Server started', { port: 3000 });
logger.warn('High memory', { usage: '90%' });
logger.error('Crash!', { code: 500 });

logger.getEntries();
// → [
//   { level: 'log', message: 'Server started', timestamp: '...', port: 3000 },
//   { level: 'warn', message: 'High memory', timestamp: '...', usage: '90%' },
//   { level: 'error', message: 'Crash!', timestamp: '...', code: 500 },
// ]
```

## Why This Comes Up in Interviews

Structured logging is a must-have in production systems. Interviewers use this to see if you understand the difference between `console.log` and proper structured logging, and if you can design a clean API.

## What You Need to Know

- Spreading metadata into the log entry object
- ISO timestamps: `new Date().toISOString()`
- Log level hierarchy filtering
- Array accumulation pattern
