'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface ConsoleEntry {
  type: 'log' | 'warn' | 'error' | 'info';
  args: unknown[];
}

function formatArg(arg: unknown): string {
  if (typeof arg === 'string') return arg;
  if (arg === null) return 'null';
  if (arg === undefined) return 'undefined';
  if (typeof arg === 'function') return arg.toString();
  try {
    return JSON.stringify(arg, null, 2);
  } catch {
    return String(arg);
  }
}

function formatEntry(entry: ConsoleEntry): string {
  return entry.args.map(formatArg).join(' ');
}

interface ConsolePanelProps {
  entries: ConsoleEntry[];
  onClear: () => void;
}

export function ConsolePanel({ entries, onClear }: ConsolePanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  return (
    <div className="mt-4 rounded-lg border border-border-subtle overflow-hidden font-mono text-sm bg-[#1A1A1A] dark:bg-[#111111]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2A2A2A] bg-[#212121] dark:bg-[#161616]">
        <div className="flex items-center gap-2">
          <span className="text-[#888] text-xs font-body font-semibold uppercase tracking-widest">
            Console
          </span>
          {entries.length > 0 && (
            <span className="text-xs bg-[#333] text-[#AAA] px-1.5 py-0.5 rounded-full font-body">
              {entries.length}
            </span>
          )}
        </div>
        {entries.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-body text-[#666] hover:text-[#AAA] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Log output area */}
      <div className="min-h-[80px] max-h-[240px] overflow-y-auto p-3 space-y-1">
        {entries.length === 0 ? (
          <p className="text-[#555] text-xs font-body italic">
            No output — console.log() statements will appear here when you run your code.
          </p>
        ) : (
          entries.map((entry, i) => (
            <div
              key={i}
              className={cn(
                'flex items-start gap-2 px-2 py-1 rounded text-xs leading-relaxed',
                entry.type === 'error' && 'bg-red-950/40 text-red-400',
                entry.type === 'warn' && 'bg-yellow-950/40 text-yellow-400',
                entry.type === 'info' && 'bg-blue-950/30 text-blue-300',
                entry.type === 'log' && 'text-[#D4D0C8]'
              )}
            >
              <span
                className={cn(
                  'shrink-0 font-semibold w-4 text-center',
                  entry.type === 'error' && 'text-red-500',
                  entry.type === 'warn' && 'text-yellow-500',
                  entry.type === 'info' && 'text-blue-400',
                  entry.type === 'log' && 'text-[#555]'
                )}
              >
                {entry.type === 'error' ? '✕' : entry.type === 'warn' ? '⚠' : entry.type === 'info' ? 'ℹ' : '>'}
              </span>
              <pre className="whitespace-pre-wrap break-all font-mono">
                {formatEntry(entry)}
              </pre>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
