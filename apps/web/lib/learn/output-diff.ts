/** Token-level diff for learn output comparison (console / predict answers). */

export type DiffSegmentKind = 'match' | 'diff' | 'missing' | 'extra';

export interface DiffSegment {
  text: string;
  kind: DiffSegmentKind;
}

export interface OutputDiffRow {
  goal: DiffSegment[];
  yours: DiffSegment[];
}

function tokenize(value: string): string[] {
  return value.trim().split(/\s+/).filter(Boolean);
}

function segment(text: string, kind: DiffSegmentKind): DiffSegment {
  return { text, kind };
}

/** Single-line token diff for space-separated console output. */
export function diffOutputTokens(expected: string, actual: string): OutputDiffRow {
  const goalTokens = tokenize(expected);
  const yoursTokens = tokenize(actual);
  const max = Math.max(goalTokens.length, yoursTokens.length);

  const goal: DiffSegment[] = [];
  const yours: DiffSegment[] = [];

  for (let i = 0; i < max; i++) {
    const g = goalTokens[i];
    const y = yoursTokens[i];

    if (g === undefined && y !== undefined) {
      yours.push(segment(y, 'extra'));
      continue;
    }
    if (y === undefined && g !== undefined) {
      goal.push(segment(g, 'missing'));
      yours.push(segment('—', 'missing'));
      continue;
    }
    if (g === y) {
      goal.push(segment(g!, 'match'));
      yours.push(segment(y!, 'match'));
    } else {
      goal.push(segment(g!, 'diff'));
      yours.push(segment(y!, 'diff'));
    }
  }

  return { goal, yours };
}

export function diffOutputMultiline(expected: string, actual: string): OutputDiffRow[] {
  const goalLines = expected.replace(/\r\n/g, '\n').split('\n');
  const yoursLines = actual.replace(/\r\n/g, '\n').split('\n');
  const max = Math.max(goalLines.length, yoursLines.length);
  const rows: OutputDiffRow[] = [];

  for (let i = 0; i < max; i++) {
    const g = goalLines[i] ?? '';
    const y = yoursLines[i] ?? '';
    if (!g && y) {
      rows.push({
        goal: [segment('—', 'missing')],
        yours: [segment(y, 'extra')],
      });
    } else if (g && !y) {
      rows.push({
        goal: [segment(g, 'missing')],
        yours: [segment('—', 'missing')],
      });
    } else {
      rows.push(diffOutputTokens(g, y));
    }
  }

  return rows;
}

export function buildOutputDiff(
  expected: string,
  actual: string,
  mode: 'subtle' | 'full'
): OutputDiffRow[] {
  const multiline = expected.includes('\n') || actual.includes('\n');
  if (multiline && mode === 'full') {
    return diffOutputMultiline(expected, actual);
  }
  return [diffOutputTokens(expected, actual)];
}
