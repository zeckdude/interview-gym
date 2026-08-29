/** Token types for lightweight JavaScript syntax highlighting. */

export type HighlightTokenType =
  | 'keyword'
  | 'string'
  | 'number'
  | 'comment'
  | 'function'
  | 'operator'
  | 'punctuation'
  | 'plain';

export interface HighlightToken {
  type: HighlightTokenType;
  value: string;
}

const KEYWORDS = new Set([
  'async',
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'default',
  'delete',
  'do',
  'else',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'function',
  'if',
  'import',
  'in',
  'instanceof',
  'let',
  'new',
  'null',
  'of',
  'return',
  'static',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typeof',
  'undefined',
  'var',
  'void',
  'while',
  'yield',
]);

/** High-contrast dark palette (VS Code Dark+ inspired). */
export const HIGHLIGHT_COLORS: Record<HighlightTokenType, string> = {
  keyword: '#79C0FF',
  string: '#BCE89A',
  number: '#FFB86C',
  comment: '#9CA3AF',
  function: '#FFD580',
  operator: '#E6EDF3',
  punctuation: '#E6EDF3',
  plain: '#E6EDF3',
};

export const HIGHLIGHT_COLORS_LIGHT: Record<HighlightTokenType, string> = {
  keyword: '#0550AE',
  string: '#0A6E0A',
  number: '#953800',
  comment: '#6B7280',
  function: '#8250DF',
  operator: '#24292F',
  punctuation: '#24292F',
  plain: '#24292F',
};

function readString(line: string, start: number): { value: string; next: number } {
  const quote = line[start];
  let value = quote;
  let i = start + 1;
  while (i < line.length) {
    if (line[i] === '\\' && i + 1 < line.length) {
      value += line[i] + line[i + 1];
      i += 2;
      continue;
    }
    value += line[i];
    if (line[i] === quote) {
      return { value, next: i + 1 };
    }
    i++;
  }
  return { value, next: i };
}

function readIdentifier(line: string, start: number): { value: string; next: number } {
  let value = '';
  let i = start;
  while (i < line.length && /[a-zA-Z0-9_$]/.test(line[i])) {
    value += line[i++];
  }
  return { value, next: i };
}

function peekNextNonSpace(line: string, index: number): string | null {
  for (let i = index; i < line.length; i++) {
    if (!/\s/.test(line[i])) return line[i];
  }
  return null;
}

export function tokenizeJavaScriptLine(line: string): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  let i = 0;

  while (i < line.length) {
    const ch = line[i];

    if (/\s/.test(ch)) {
      let value = '';
      while (i < line.length && /\s/.test(line[i])) value += line[i++];
      tokens.push({ type: 'plain', value });
      continue;
    }

    if (line.slice(i, i + 2) === '//') {
      tokens.push({ type: 'comment', value: line.slice(i) });
      break;
    }

    if (ch === "'" || ch === '"' || ch === '`') {
      const { value, next } = readString(line, i);
      tokens.push({ type: 'string', value });
      i = next;
      continue;
    }

    if (/[0-9]/.test(ch)) {
      let value = '';
      while (i < line.length && /[0-9.]/.test(line[i])) value += line[i++];
      tokens.push({ type: 'number', value });
      continue;
    }

    if (/[a-zA-Z_$]/.test(ch)) {
      const { value, next } = readIdentifier(line, i);
      i = next;
      if (KEYWORDS.has(value)) {
        tokens.push({ type: 'keyword', value });
      } else if (peekNextNonSpace(line, i) === '(') {
        tokens.push({ type: 'function', value });
      } else {
        tokens.push({ type: 'plain', value });
      }
      continue;
    }

    if ('=<>!+-*/%&|^~?:'.includes(ch)) {
      let value = ch;
      i++;
      if (i < line.length && '=<>'.includes(ch) && line[i] === '=') {
        value += line[i++];
      }
      tokens.push({ type: 'operator', value });
      continue;
    }

    tokens.push({ type: 'punctuation', value: ch });
    i++;
  }

  return tokens;
}

export function tokenizeJavaScript(code: string): HighlightToken[][] {
  return code.split('\n').map(tokenizeJavaScriptLine);
}
