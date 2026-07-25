import { describe, expect, it } from 'vitest';
import {
  prepareTextForSpeech,
  sectionSpeechText,
  splitIntoSpeechSentences,
  splitMarkdownIntoSections,
} from '@/lib/markdown-to-speech';
import { normalizeTtsText } from '@/lib/deepgram';

describe('markdown-to-speech', () => {
  it('strips markdown formatting for speech', () => {
    const text = prepareTextForSpeech('## Title\n\n- Use `fs.readFileSync`\n\n> Expected: **HELLO**');
    expect(text).toContain('Title');
    expect(text).toContain('fs.readFileSync');
    expect(text).toContain('Expected');
    expect(text).toContain('HELLO');
    expect(text).not.toContain('**');
    expect(text).not.toContain('`');
  });

  it('strips emoji and keeps numbered lists readable', () => {
    const text = prepareTextForSpeech('💡 **Tip:** Use 1. first item 2. second item');
    expect(text).not.toMatch(/💡/);
    expect(text).toContain('Tip');
    expect(text).toContain('1. first item');
  });

  it('splits speech sentences after cleanup', () => {
    const sentences = splitIntoSpeechSentences('First idea. Second idea!');
    expect(sentences).toEqual(['First idea.', 'Second idea!']);
  });

  it('splits markdown into sections by headings', () => {
    const sections = splitMarkdownIntoSections(`## The Challenge\n\nDo the thing.\n\n### What you need to know\n\n- item one`);
    expect(sections).toHaveLength(2);
    expect(sections[0].heading).toBe('The Challenge');
    expect(sections[1].heading).toBe('What you need to know');
  });

  it('builds section speech text with heading and body', () => {
    const section = {
      heading: 'The Challenge',
      level: 2 as const,
      markdown: 'Read a file and write output.',
    };
    expect(sectionSpeechText(section)).toBe('The Challenge. Read a file and write output.');
  });
});

describe('deepgram helpers', () => {
  it('truncates very long TTS input', () => {
    const long = 'a'.repeat(5000);
    const normalized = normalizeTtsText(long);
    expect(normalized.length).toBeLessThanOrEqual(4000);
    expect(normalized.endsWith('...')).toBe(true);
  });
});
