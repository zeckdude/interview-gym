/** Helpers for locating the likely error line in learner code. */

function codeLines(code: string): string[] {
  return code.replace(/\r\n/g, '\n').split('\n');
}

function stripLineComments(line: string): string {
  return line.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
}

function findIdentifierUsageLine(code: string, name: string): number | null {
  const lines = codeLines(code);
  const pattern = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
  for (let i = 0; i < lines.length; i++) {
    const codePart = stripLineComments(lines[i]!);
    if (!codePart.trim()) continue;
    if (pattern.test(codePart)) return i + 1;
  }
  return null;
}

function findLastNonEmptyLine(code: string): number | null {
  const lines = codeLines(code);
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i]!.trim()) return i + 1;
  }
  return lines.length > 0 ? 1 : null;
}

function findFirstConsoleLogLine(code: string): number | null {
  const lines = codeLines(code);
  for (let i = 0; i < lines.length; i++) {
    if (/console\.log/.test(lines[i]!)) return i + 1;
  }
  return null;
}

/** Map a 1-based line in full combined code to the editable user section. */
export function mapFullCodeLineToUserLine(
  fullLine: number | null | undefined,
  setupLineCount: number
): number | null {
  if (fullLine == null || fullLine < 1) return null;
  if (fullLine <= setupLineCount) return null;
  return fullLine - setupLineCount;
}

/** Parse eval stack traces from `new Function` execution. */
export function extractEvalLineFromStack(
  stack: string | undefined,
  wrapperLineOffset: number
): number | null {
  if (!stack) return null;
  const match = stack.match(/<anonymous>:(\d+):\d+/);
  if (!match) return null;
  const evalLine = Number.parseInt(match[1]!, 10);
  const userLine = evalLine - wrapperLineOffset;
  return userLine >= 1 ? userLine : null;
}

function findIncompleteDeclarationLine(code: string): number | null {
  const lines = codeLines(code);
  for (let i = 0; i < lines.length; i++) {
    const codePart = stripLineComments(lines[i]!);
    if (/^\s*(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*$/.test(codePart)) {
      return i + 1;
    }
  }
  return null;
}

/** Best-effort 1-based line number in the provided code for a runtime error message. */
export function findErrorLineInCode(code: string, error?: string): number | null {
  if (!error?.trim()) return null;

  const notDefined = error.match(/(\w+) is not defined/);
  if (notDefined) {
    return findIdentifierUsageLine(code, notDefined[1]!);
  }

  const tdz = error.match(/Cannot access '([^']+)' before initialization/);
  if (tdz) {
    return findIdentifierUsageLine(code, tdz[1]!);
  }

  const assignConst = error.match(/Assignment to constant variable/);
  if (assignConst) {
    const lines = codeLines(code);
    for (let i = lines.length - 1; i >= 0; i--) {
      if (/=\s*[^=]/.test(lines[i]!) && !/(const|let|var)\s/.test(lines[i]!)) {
        return i + 1;
      }
    }
  }

  if (/SyntaxError|Unexpected token|already been declared|Missing initializer/i.test(error)) {
    return (
      findIncompleteDeclarationLine(code) ??
      findLastNonEmptyLine(code)
    );
  }

  return findLastNonEmptyLine(code);
}

export function findOutputMismatchLine(code: string): number | null {
  return findFirstConsoleLogLine(code) ?? findLastNonEmptyLine(code);
}

/** Strip setup prefix from persisted full code for the editable region. */
export function extractUserCodeFromStored(
  stored: string,
  setupCode: string,
  starterCode: string
): string {
  const normalizedSetup = setupCode.replace(/\r\n/g, '\n');
  const normalizedStored = stored.replace(/\r\n/g, '\n');
  const prefix = `${normalizedSetup}\n`;
  if (normalizedStored.startsWith(prefix)) {
    return normalizedStored.slice(prefix.length);
  }
  if (normalizedStored === normalizedSetup) return starterCode;
  return normalizedStored.trim() ? normalizedStored : starterCode;
}

/** Combine setup + user code for execution. */
export function combineLearnCode(setupCode: string, userCode: string): string {
  const setup = setupCode.replace(/\r\n/g, '\n').trimEnd();
  const user = userCode.replace(/\r\n/g, '\n');
  if (!setup) return user;
  if (!user.trim()) return setup;
  return `${setup}\n${user}`;
}

export function countCodeLines(code: string): number {
  if (!code) return 1;
  return code.replace(/\r\n/g, '\n').split('\n').length;
}
