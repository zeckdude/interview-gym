'use client';

import Link from 'next/link';
import type { UserChallenge } from '@prisma/client';
import { Badge } from '@/components/ui/Badge';
import type { ChallengeCategory, ChallengeDifficulty } from '@/data/types';

interface GeneratedChallengePreviewProps {
  challenge: UserChallenge;
  difficultyReasoning?: string | null;
}

export function GeneratedChallengePreview({
  challenge,
  difficultyReasoning,
}: GeneratedChallengePreviewProps) {
  const plainPreview = challenge.description
    .replace(/[#*`>[\]]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 200);

  return (
    <div className="bg-bg-surface rounded-xl shadow-raised border border-border-subtle overflow-hidden">
      <div className="bg-brand px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="font-display text-xl font-bold text-white">{challenge.title}</h2>
          <div className="flex gap-2">
            <Badge
              type="difficulty"
              value={challenge.difficulty as ChallengeDifficulty}
            />
            <Badge
              type="category"
              value={challenge.category as ChallengeCategory}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {difficultyReasoning && (
          <p className="font-body text-sm text-text-secondary mb-4 bg-bg-subtle rounded-lg px-4 py-3 border border-border-subtle">
            {difficultyReasoning}
          </p>
        )}

        <div className="flex gap-3 mb-4 flex-wrap">
          {challenge.concepts.map((c) => (
            <span
              key={c}
              className="bg-bg-subtle text-text-secondary text-xs font-body px-2.5 py-1 rounded-full"
            >
              {c}
            </span>
          ))}
        </div>

        <p className="font-body text-sm text-text-secondary mb-6 leading-relaxed">
          {plainPreview}…
        </p>

        <div className="flex gap-3 flex-wrap">
          <Link
            href={`/my-challenges/${challenge.id}`}
            className="font-body font-semibold px-6 py-3 rounded-md bg-brand hover:bg-brand-dark text-white shadow-brand transition-all duration-150 inline-flex items-center"
          >
            Start Challenge →
          </Link>
          <Link
            href={`/my-challenges/${challenge.id}/lesson`}
            className="font-body font-semibold px-6 py-3 rounded-md bg-bg-subtle hover:bg-border-subtle text-text-primary border border-border-subtle transition-all duration-150 inline-flex items-center"
          >
            View Lesson First
          </Link>
        </div>
      </div>
    </div>
  );
}
