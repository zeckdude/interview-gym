/** Normalize LLM draft text: literal \\n → newlines, bullet • → markdown list. */
export function normalizePlaybookMarkdown(text: string): string {
  return text
    .replace(/\\n/g, '\n')
    .split('\n')
    .map((line) => (line.startsWith('• ') ? `- ${line.slice(2)}` : line))
    .join('\n')
    .trim();
}
