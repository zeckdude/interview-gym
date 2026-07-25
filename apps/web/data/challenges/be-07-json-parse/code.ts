export const starterTs = `type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function safeJsonParse<T = unknown>(json: string): ParseResult<T> {
  // Implement safe JSON parsing here
  
}

export { safeJsonParse };`;

export const starterJs = `function safeJsonParse(json) {
  // Implement safe JSON parsing here
  
}

module.exports = { safeJsonParse };`;

export const solutionTs = `type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function safeJsonParse<T = unknown>(json: string): ParseResult<T> {
  try {
    const value = JSON.parse(json) as T;
    return { ok: true, value };
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : String(e);
    return { ok: false, error };
  }
}

export { safeJsonParse };`;

export const solutionJs = `function safeJsonParse(json) {
  try {
    const value = JSON.parse(json);
    return { ok: true, value };
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    return { ok: false, error };
  }
}

module.exports = { safeJsonParse };`;
