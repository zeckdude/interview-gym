export interface MarkdownSection {
  heading: string | null;
  level: 2 | 3 | null;
  markdown: string;
}

export interface ReadAlongSource {
  headline?: string | null;
  body: string;
}

export interface ReadAlongPlan {
  headlinePrepared: string | null;
  bodySentences: string[];
  fullPrepared: string;
}

const EMOJI_REGEX =
  /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;

const CODE_ONLY_PATTERN = /^```[\s\S]*```$/;

/** True when section content is only a fenced code block — skip listen controls. */
export function isCodeOnlyMarkdown(markdown: string): boolean {
  return CODE_ONLY_PATTERN.test(markdown.trim());
}

/** Plain text safe for Deepgram — strips markdown; inline code kept literally. */
export function prepareTextForSpeechBase(text: string): string {
  let result = text;

  result = result.replace(EMOJI_REGEX, '');

  result = result.replace(/```[\s\S]*?```/g, ' code example ');
  result = result.replace(/`([^`]+)`/g, '$1');
  result = result.replace(/^#{1,6}\s+/gm, '');
  result = result.replace(/^>\s?/gm, '');

  result = result.replace(/\*\*([^*]+)\*\*/g, '$1');
  result = result.replace(/\*([^*+]+)\*/g, '$1');
  result = result.replace(/__([^_]+)__/g, '$1');
  result = result.replace(/_([^_]+)_/g, '$1');
  result = result.replace(/~~([^~]+)~~/g, '$1');

  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  result = result.replace(/^[\s]*[-*+]\s+/gm, '');

  result = result.replace(/[*_~#`]/g, '');

  result = result.replace(/\s+/g, ' ').trim();
  return result;
}

/** @deprecated Prefer prepareTextForSpeechAsync for TTS with inline code expansion. */
export function prepareTextForSpeech(text: string): string {
  return prepareTextForSpeechBase(text);
}

const speechPrepareCache = new Map<string, string>();
const speechPrepareInflight = new Map<string, Promise<string>>();

function hashSpeechText(text: string): string {
  let hash = 5381;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

/** LLM-expands inline code for natural TTS; caches results client-side. */
export async function prepareTextForSpeechAsync(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';

  const key = hashSpeechText(trimmed);
  const cached = speechPrepareCache.get(key);
  if (cached) return cached;

  const pending = speechPrepareInflight.get(key);
  if (pending) return pending;

  const hasCode = /`/.test(trimmed);
  if (!hasCode) {
    const prepared = prepareTextForSpeechBase(trimmed);
    speechPrepareCache.set(key, prepared);
    return prepared;
  }

  const request = (async () => {
    const res = await fetch('/api/ai/speech-preprocess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed }),
    });

    if (!res.ok) {
      return prepareTextForSpeechBase(trimmed);
    }

    const data = (await res.json()) as { prepared?: string };
    const prepared = data.prepared?.trim() || prepareTextForSpeechBase(trimmed);
    speechPrepareCache.set(key, prepared);
    speechPrepareInflight.delete(key);
    return prepared;
  })();

  speechPrepareInflight.set(key, request);
  try {
    return await request;
  } catch {
    speechPrepareInflight.delete(key);
    return prepareTextForSpeechBase(trimmed);
  }
}

/** @deprecated Use prepareTextForSpeech */
export const markdownToSpeechText = prepareTextForSpeech;

export function splitIntoSpeechSentences(text: string): string[] {
  const prepared = prepareTextForSpeech(text);
  return splitPreparedSentences(prepared);
}

export function splitPreparedSentences(prepared: string): string[] {
  if (!prepared) return [];

  return prepared
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function buildReadAlongPlan(source: ReadAlongSource): ReadAlongPlan {
  const headlinePrepared = source.headline?.trim()
    ? prepareTextForSpeech(source.headline)
    : null;
  const bodyPrepared = prepareTextForSpeech(source.body);
  const bodySentences = splitPreparedSentences(bodyPrepared);
  const fullPrepared = [headlinePrepared, bodyPrepared].filter(Boolean).join('. ');

  return { headlinePrepared, bodySentences, fullPrepared };
}

export async function buildReadAlongPlanAsync(source: ReadAlongSource): Promise<ReadAlongPlan> {
  const headlinePrepared = source.headline?.trim()
    ? await prepareTextForSpeechAsync(source.headline)
    : null;
  const bodyPrepared = await prepareTextForSpeechAsync(source.body);
  const bodySentences = splitPreparedSentences(bodyPrepared);
  const fullPrepared = [headlinePrepared, bodyPrepared].filter(Boolean).join('. ');

  return { headlinePrepared, bodySentences, fullPrepared };
}

export function splitMarkdownIntoSections(markdown: string): MarkdownSection[] {
  const lines = markdown.trim().split('\n');
  const sections: MarkdownSection[] = [];
  let current: MarkdownSection = { heading: null, level: null, markdown: '' };

  const pushCurrent = () => {
    const body = current.markdown.trim();
    if (current.heading || body) {
      sections.push({
        heading: current.heading,
        level: current.level,
        markdown: body,
      });
    }
  };

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)/);
    const h3 = line.match(/^###\s+(.+)/);

    if (h2 || h3) {
      pushCurrent();
      current = {
        heading: (h2 ?? h3)![1].trim(),
        level: h2 ? 2 : 3,
        markdown: '',
      };
      continue;
    }

    current.markdown += (current.markdown ? '\n' : '') + line;
  }

  pushCurrent();
  return sections;
}

export function sectionSpeechText(section: MarkdownSection): string {
  return buildReadAlongPlan({
    headline: section.heading,
    body: section.markdown,
  }).fullPrepared;
}
