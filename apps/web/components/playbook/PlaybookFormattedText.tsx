import ReactMarkdown from 'react-markdown';
import { normalizePlaybookMarkdown } from '@/lib/playbook/format-content';

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-bold">{children}</strong>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-4 mb-2 space-y-2">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal pl-4 mb-2 space-y-2">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
};

interface PlaybookFormattedTextProps {
  text: string;
  className?: string;
}

export function PlaybookFormattedText({ text, className }: PlaybookFormattedTextProps) {
  return (
    <div className={className}>
      <ReactMarkdown components={markdownComponents}>
        {normalizePlaybookMarkdown(text)}
      </ReactMarkdown>
    </div>
  );
}
