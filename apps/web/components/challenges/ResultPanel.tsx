import type { ValidationResult } from '@/data/types';
import { cn } from '@/lib/utils';

interface ResultPanelProps {
  result: ValidationResult | null;
  isRunning: boolean;
}

export function ResultPanel({ result, isRunning }: ResultPanelProps) {
  if (isRunning) {
    return (
      <div className="mt-4 p-4 bg-bg-subtle dark:bg-[#252525] rounded-lg border border-border-subtle dark:border-[#2A2A2A]">
        <p className="font-body text-text-secondary dark:text-[#AAA5A0]">Running tests...</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="mt-4 space-y-4">
      <div
        className={cn(
          'p-4 rounded-lg font-body font-semibold',
          result.passed
            ? 'bg-success-light text-success'
            : 'bg-error-light text-error'
        )}
      >
        {result.passed
          ? '✓ Challenge Passed!'
          : '✗ Not quite — try again'}
      </div>

      <div className="space-y-2">
        {result.results.map((test, i) => (
          <div
            key={i}
            className={cn(
              'p-3 rounded-md border text-sm font-body',
              test.passed
                ? 'bg-success-light/50 border-success/30'
                : 'bg-error-light/50 border-error/30'
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <span>{test.passed ? '✓' : '✗'}</span>
              <span className="font-semibold text-text-primary dark:text-[#F0EDE8]">
                {test.description}
              </span>
            </div>
            {!test.passed && (
              <div className="ml-6 space-y-1 text-text-secondary dark:text-[#AAA5A0]">
                <p>
                  <span className="font-semibold">Expected:</span>{' '}
                  <code className="font-mono text-xs bg-bg-surface dark:bg-[#1A1A1A] px-1 py-0.5 rounded-sm">
                    {test.expected}
                  </code>
                </p>
                <p>
                  <span className="font-semibold">Actual:</span>{' '}
                  <code className="font-mono text-xs bg-bg-surface dark:bg-[#1A1A1A] px-1 py-0.5 rounded-sm">
                    {test.actual}
                  </code>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
