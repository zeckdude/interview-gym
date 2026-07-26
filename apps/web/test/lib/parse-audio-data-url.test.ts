import { describe, expect, it } from 'vitest';
import { parseAudioBase64Payload } from '@/lib/parse-audio-data-url';

describe('parseAudioBase64Payload', () => {
  it('parses data URLs with codecs parameter', () => {
    const payload = Buffer.from('hello-audio').toString('base64');
    const input = `data:audio/webm;codecs=opus;base64,${payload}`;
    const result = parseAudioBase64Payload(input);

    expect(result.contentType).toBe('audio/webm');
    expect(result.buffer.toString()).toBe('hello-audio');
  });

  it('parses simple data URLs', () => {
    const payload = Buffer.from('test').toString('base64');
    const input = `data:audio/mp4;base64,${payload}`;
    const result = parseAudioBase64Payload(input);

    expect(result.contentType).toBe('audio/mp4');
    expect(result.buffer.toString()).toBe('test');
  });

  it('parses raw base64', () => {
    const payload = Buffer.from('raw').toString('base64');
    const result = parseAudioBase64Payload(payload, 'audio/webm');

    expect(result.contentType).toBe('audio/webm');
    expect(result.buffer.toString()).toBe('raw');
  });

  it('throws on empty input', () => {
    expect(() => parseAudioBase64Payload('')).toThrow('Empty audio payload');
  });
});
