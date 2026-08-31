'use client';

import Link from 'next/link';
import { ShippedStepDemo } from '@/components/ops/learn-problems/ShippedStepDemo';
import {
  FillBlankPrototype,
  FindBugPrototype,
  MatchUpPrototype,
  PutInOrderPrototype,
  SmallestFixPrototype,
  StepThroughPrototype,
  TryItPrototype,
  WatchTinkerPrototype,
  WhatChangedPrototype,
  WhatsNextPrototype,
} from '@/components/ops/learn-problems/ProblemPrototypes';
import {
  DEMO_CHOICE_STEP,
  DEMO_CODE_CHALLENGE_STEP,
  DEMO_CODE_INTRO_STEP,
  DEMO_PREDICT_STEP,
  PROBLEM_TYPES,
  type ProblemStatus,
} from '@/components/ops/learn-problems/showcase-data';
import { cn } from '@/lib/utils';

function StatusBadge({ status }: { status: ProblemStatus }) {
  return (
    <span
      className={cn(
        'text-xs font-body font-semibold px-2.5 py-1 rounded-sm inline-block',
        status === 'shipped'
          ? 'bg-success-light text-success'
          : 'bg-warning-light text-warning'
      )}
    >
      {status === 'shipped' ? 'Shipped' : 'Prototype'}
    </span>
  );
}

function ShowcaseSection({
  id,
  title,
  internalId,
  status,
  blurb,
  children,
}: {
  id: string;
  title: string;
  internalId: string;
  status: ProblemStatus;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 space-y-6">
      <div className="space-y-3 border-b border-border-subtle pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display font-bold text-2xl text-text-primary">{title}</h2>
          <StatusBadge status={status} />
          <code className="font-mono text-xs text-text-muted bg-bg-subtle px-2 py-1 rounded">
            {internalId}
          </code>
        </div>
        <p className="font-body text-base text-text-primary max-w-3xl">{blurb}</p>
      </div>
      <div className="rounded-xl border border-border-subtle bg-bg-base p-4 sm:p-6">{children}</div>
    </section>
  );
}

function renderPrototype(anchor: string) {
  switch (anchor) {
    case 'step-through':
      return <StepThroughPrototype />;
    case 'find-bug':
      return <FindBugPrototype />;
    case 'put-in-order':
      return <PutInOrderPrototype />;
    case 'fill-blank':
      return <FillBlankPrototype />;
    case 'smallest-fix':
      return <SmallestFixPrototype />;
    case 'what-changed':
      return <WhatChangedPrototype />;
    case 'try-it':
      return <TryItPrototype />;
    case 'watch-tinker':
      return <WatchTinkerPrototype />;
    case 'whats-next':
      return <WhatsNextPrototype />;
    case 'match-up':
      return <MatchUpPrototype />;
    default:
      return null;
  }
}

function renderShipped(anchor: string) {
  switch (anchor) {
    case 'predict-output':
      return <ShippedStepDemo step={DEMO_PREDICT_STEP} />;
    case 'pick-one':
      return <ShippedStepDemo step={DEMO_CHOICE_STEP} />;
    case 'write-code':
      return (
        <ShippedStepDemo
          step={DEMO_CODE_CHALLENGE_STEP}
          previousStep={DEMO_CODE_INTRO_STEP}
        />
      );
    default:
      return null;
  }
}

export function LearnProblemsShowcaseClient() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-12">
      <div className="space-y-4">
        <Link
          href="/ops"
          className="font-body text-sm font-semibold text-brand hover:underline"
        >
          ← Ops hub
        </Link>
        <h1 className="font-display font-bold text-3xl text-text-primary">
          Learn problem types
        </h1>
        <p className="font-body text-base text-text-primary max-w-3xl">
          Interactive demos for every learn-path problem format — three production step types
          plus ten prototypes. Use this page to feel each interaction before authoring content.
        </p>
      </div>

      <nav
        aria-label="Problem type jump links"
        className="sticky top-[4.5rem] z-30 -mx-6 px-6 py-3 bg-bg-base/95 backdrop-blur border-y border-border-subtle"
      >
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {PROBLEM_TYPES.map((type) => (
            <li key={type.id} className="shrink-0">
              <a
                href={`#${type.anchor}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-surface px-3 py-1.5 font-body text-xs font-semibold text-text-primary hover:border-brand/40 whitespace-nowrap"
              >
                {type.name}
                {type.status === 'prototype' && (
                  <span className="text-warning" aria-hidden>
                    •
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-16">
        {PROBLEM_TYPES.map((type) => (
          <ShowcaseSection
            key={type.id}
            id={type.anchor}
            title={type.name}
            internalId={type.internalId}
            status={type.status}
            blurb={type.blurb}
          >
            {type.status === 'shipped'
              ? renderShipped(type.anchor)
              : renderPrototype(type.anchor)}
          </ShowcaseSection>
        ))}
      </div>
    </main>
  );
}
