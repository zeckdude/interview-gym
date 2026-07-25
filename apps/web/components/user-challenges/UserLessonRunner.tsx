'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import type { UserChallenge } from '@prisma/client';
import { ContentBreadcrumbs } from '@/components/content/ContentBreadcrumbs';
import { ContentDetailMenu } from '@/components/content/ContentDetailMenu';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Badge } from '@/components/ui/Badge';
import type { ChallengeCategory, ChallengeDifficulty } from '@/data/types';

interface UserLessonRunnerProps {
  record: UserChallenge;
}

export function UserLessonRunner({ record }: UserLessonRunnerProps) {
  return (
    <PageWrapper title={record.title}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-3">
          <ContentBreadcrumbs
            items={[
              { label: 'My Challenges', href: '/my-challenges' },
              { label: record.title, href: `/my-challenges/${record.id}` },
              { label: 'Lesson' },
            ]}
          />
          <ContentDetailMenu
            studyPlan={{
              itemType: 'user-challenge',
              itemId: record.id,
              source: 'generated',
            }}
          />
        </div>

        <div className="bg-brand-light border border-brand/30 rounded-lg px-4 py-3">
          <p className="font-body text-sm text-text-primary">
            This lesson was generated from your interview description.
          </p>
        </div>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display font-bold text-3xl text-text-primary mb-3">
              {record.title}
            </h1>
            <div className="flex gap-2">
              <Badge type="category" value={record.category as ChallengeCategory} />
              <Badge type="difficulty" value={record.difficulty as ChallengeDifficulty} />
            </div>
          </div>
          <Link
            href={`/my-challenges/${record.id}`}
            className="font-body text-sm font-semibold px-4 py-2 rounded-md bg-brand text-white hover:bg-brand-dark transition-colors"
          >
            Start Challenge →
          </Link>
        </div>

        <div className="bg-bg-surface rounded-xl border border-border-subtle shadow-card px-6 py-8 prose-lesson">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <div className="flex items-center gap-3 pb-4 mt-8 first:mt-0">
                  <div className="w-1.5 h-8 bg-brand rounded-full flex-shrink-0" />
                  <h2 className="font-display font-bold text-xl text-text-primary">{children}</h2>
                </div>
              ),
              h3: ({ children }) => (
                <h3 className="font-display font-semibold text-base text-cat-be mt-6 mb-3">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="font-body text-base text-text-primary leading-relaxed mb-4">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="font-body text-base text-text-primary space-y-2 mb-4 pl-5 list-disc">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="font-body text-base text-text-primary space-y-2 mb-4 pl-5 list-decimal">
                  {children}
                </ol>
              ),
              code: ({ children, className }) => {
                const isBlock = className?.includes('language-');
                return isBlock ? (
                  <code className="block bg-bg-inverse text-text-inverse font-mono text-sm rounded-lg p-4 my-4 overflow-x-auto">
                    {children}
                  </code>
                ) : (
                  <code className="font-mono text-sm bg-bg-subtle px-1.5 py-0.5 rounded">
                    {children}
                  </code>
                );
              },
              blockquote: ({ children }) => (
                <div className="bg-warning-light border-l-4 border-warning rounded-r-lg px-5 py-4 my-4">
                  {children}
                </div>
              ),
            }}
          >
            {record.lessonContent}
          </ReactMarkdown>
        </div>

        {record.miniChallengePrompt && (
          <div className="bg-bg-surface rounded-xl border border-border-subtle shadow-card px-6 py-6">
            <h2 className="font-display font-bold text-lg text-text-primary mb-3">
              Warm-Up Mini-Challenge
            </h2>
            <p className="font-body text-base text-text-primary leading-relaxed mb-4">
              {record.miniChallengePrompt}
            </p>
            <Link
              href={`/my-challenges/${record.id}`}
              className="font-body text-sm font-semibold px-4 py-2 rounded-md bg-brand text-white hover:bg-brand-dark transition-colors inline-flex"
            >
              Try the Full Challenge →
            </Link>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
