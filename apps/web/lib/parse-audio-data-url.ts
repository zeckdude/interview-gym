export interface ParsedAudioPayload {
  contentType: string;
  buffer: Buffer;
}

/**
 * Parse a data URL or raw base64 audio payload from the client.
 * Handles mime types with parameters, e.g. `audio/webm;codecs=opus`.
 */
export function parseAudioBase64Payload(
  input: string,
  fallbackContentType = 'audio/webm'
): ParsedAudioPayload {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('Empty audio payload');
  }

  if (trimmed.startsWith('data:')) {
    const commaIndex = trimmed.indexOf(',');
    if (commaIndex === -1) {
      throw new Error('Invalid data URL: missing comma separator');
    }

    const meta = trimmed.slice('data:'.length, commaIndex);
    const base64 = trimmed.slice(commaIndex + 1);
    const contentType = meta.split(';')[0]?.trim() || fallbackContentType;

    if (!base64) {
      throw new Error('Invalid data URL: empty base64 payload');
    }

    return {
      contentType,
      buffer: Buffer.from(base64, 'base64'),
    };
  }

  return {
    contentType: fallbackContentType,
    buffer: Buffer.from(trimmed, 'base64'),
  };
}
