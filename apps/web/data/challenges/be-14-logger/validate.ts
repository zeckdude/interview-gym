import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  [key: string]: unknown;
}

interface Logger {
  log(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
  debug(message: string, meta?: Record<string, unknown>): void;
  getEntries(): LogEntry[];
}

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createLogger = getExport<(opts?: { level?: string }) => Logger>(exports, 'createLogger');

    // Test 1: records log entries with correct shape
    const logger = createLogger();
    logger.log('hello', { port: 3000 });
    const entries = logger.getEntries();
    const e = entries[0];
    const test1 = entries.length === 1 && e.level === 'log' && e.message === 'hello' && e.port === 3000 && typeof e.timestamp === 'string';

    // Test 2: multiple levels captured
    const l2 = createLogger();
    l2.log('a');
    l2.warn('b');
    l2.error('c');
    const test2 = l2.getEntries().length === 3;

    // Test 3: level filter (error only) suppresses lower levels
    const l3 = createLogger({ level: 'error' });
    l3.log('ignored');
    l3.warn('also ignored');
    l3.error('captured');
    const e3 = l3.getEntries();
    const test3 = e3.length === 1 && e3[0].level === 'error';

    return {
      passed: test1 && test2 && test3,
      results: [
        { description: 'Log entry has correct shape (level, message, timestamp, meta)', expected: 'level=log message=hello port=3000', actual: e ? `level=${e.level} message=${e.message} port=${e.port}` : 'no entry', passed: test1 },
        { description: 'All levels (log/warn/error) are captured by default', expected: '3 entries', actual: `${l2.getEntries().length} entries`, passed: test2 },
        { description: 'Level filter suppresses lower-priority levels', expected: '1 error entry', actual: `${e3.length} entries`, passed: test3 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
