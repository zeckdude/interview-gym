import type { PlaybookDraftTarget } from '@/lib/playbook/playbook-context';

const DRAFT_FIELD_KEYS = new Set(['target', 'title', 'question', 'subsection', 'content']);

function parseDraftFields(block: string): Record<string, string> {
  const fields: Record<string, string> = {};
  const lines = block.split('\n');
  let currentKey: string | null = null;
  let currentLines: string[] = [];

  const flush = () => {
    if (currentKey) {
      fields[currentKey] = currentLines.join('\n').trim();
    }
  };

  for (const line of lines) {
    const colon = line.indexOf(':');
    const maybeKey = colon > 0 ? line.slice(0, colon).trim().toLowerCase() : '';

    if (maybeKey && DRAFT_FIELD_KEYS.has(maybeKey)) {
      flush();
      currentKey = maybeKey;
      currentLines = [line.slice(colon + 1)];
    } else if (currentKey) {
      currentLines.push(line);
    }
  }

  flush();
  return fields;
}

function fieldsToDraft(fields: Record<string, string>): PlaybookDraftTarget | null {
  const target = fields.target ?? 'subsection';
  const content = fields.content ?? '';

  if (!content.trim()) return null;

  if (target === 'new-entry') {
    return {
      type: 'new-entry',
      title: fields.title,
      questionPrompt: fields.question,
      subsectionLabel: fields.subsection,
      content,
    };
  }

  if (target === 'entry-title') {
    return { type: 'entry-title', content: fields.content ?? fields.title ?? content };
  }

  if (target === 'entry-question') {
    return { type: 'entry-question', content: fields.content ?? fields.question ?? content };
  }

  return {
    type: 'subsection',
    subsectionLabel: fields.subsection ?? target,
    content,
  };
}

export function parseDraftBlock(raw: string): PlaybookDraftTarget | null {
  const match = raw.match(/\[DRAFT\]([\s\S]*?)\[\/DRAFT\]/i);
  if (!match) return null;
  return fieldsToDraft(parseDraftFields(match[1]));
}

export function parseAllDraftBlocks(raw: string): PlaybookDraftTarget[] {
  const drafts: PlaybookDraftTarget[] = [];
  const pattern = /\[DRAFT\]([\s\S]*?)\[\/DRAFT\]/gi;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(raw)) !== null) {
    const draft = fieldsToDraft(parseDraftFields(match[1]));
    if (draft) drafts.push(draft);
  }

  return drafts;
}

export function stripDraftBlocks(content: string): string {
  return content.replace(/\[DRAFT\][\s\S]*?\[\/DRAFT\]/gi, '').trim();
}

export function resolveDraftSubsectionIds(
  drafts: PlaybookDraftTarget[],
  subsections: { id: string; label: string }[]
): PlaybookDraftTarget[] {
  return drafts.map((draft) => {
    if (draft.type !== 'subsection' || draft.subsectionId || !draft.subsectionLabel) {
      return draft;
    }

    const match = subsections.find(
      (s) => s.label.toLowerCase() === draft.subsectionLabel!.toLowerCase()
    );

    return match ? { ...draft, subsectionId: match.id } : draft;
  });
}
