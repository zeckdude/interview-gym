'use client';

import { useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { AiConfirmationModal } from '@/components/challenges/AiConfirmationModal';
import {
  NoteHintBanner,
  NoteHintModal,
  RevealedNoteCard,
} from '@/components/challenges/NoteHintModal';
import { FilterTabs } from '@/components/challenges/FilterTabs';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { challenge as sampleChallenge } from '@/data/challenges/be-01-list-files';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LooksSwitcher } from '@/components/ui/LooksSwitcher';
import { PillToggle } from '@/components/ui/PillToggle';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Spinner } from '@/components/ui/Spinner';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Toggle } from '@/components/ui/Toggle';
import type { ThemeTokens } from '@/lib/themes/types';
import type { ContentFilterCategory } from '@/lib/categories';
import { cn } from '@/lib/utils';

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-6">
      <div className="space-y-2 border-b border-border-subtle pb-4">
        <h2 className="font-display font-bold text-2xl text-text-primary">{title}</h2>
        {description && (
          <p className="font-body text-base text-text-primary max-w-3xl">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function Swatch({ label, color, textColor }: { label: string; color: string; textColor?: string }) {
  return (
    <div className="rounded-lg border border-border-subtle overflow-hidden">
      <div className="h-14" style={{ backgroundColor: color }} />
      <div className="p-3 space-y-1 bg-bg-surface">
        <p className="font-body text-sm font-semibold text-text-primary">{label}</p>
        <p className="font-mono text-xs text-text-muted">{color}</p>
        {textColor && (
          <p className="font-body text-xs" style={{ color: textColor }}>
            Sample text
          </p>
        )}
      </div>
    </div>
  );
}

function tokenSwatches(tokens: ThemeTokens) {
  const entries: { label: string; color: string; pairedText?: string }[] = [
    { label: 'bg-base', color: tokens.bgBase, pairedText: tokens.textPrimary },
    { label: 'bg-surface', color: tokens.bgSurface, pairedText: tokens.textPrimary },
    { label: 'bg-subtle', color: tokens.bgSubtle, pairedText: tokens.textPrimary },
    { label: 'brand', color: tokens.brand },
    { label: 'brand-light', color: tokens.brandLight, pairedText: tokens.textPrimary },
    { label: 'text-primary', color: tokens.textPrimary },
    { label: 'text-secondary', color: tokens.textSecondary },
    { label: 'text-muted', color: tokens.textMuted },
    { label: 'border-subtle', color: tokens.borderSubtle },
    { label: 'success-light', color: tokens.successLight, pairedText: tokens.textPrimary },
    { label: 'error-light', color: tokens.errorLight, pairedText: tokens.textPrimary },
    { label: 'warning-light', color: tokens.warningLight, pairedText: tokens.textPrimary },
    { label: 'code-bg', color: tokens.codeBg, pairedText: tokens.textPrimary },
  ];
  return entries;
}

const NAV_SECTIONS = [
  { id: 'theme', label: 'Theme' },
  { id: 'typography', label: 'Typography' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'badges', label: 'Badges' },
  { id: 'forms', label: 'Form controls' },
  { id: 'cards', label: 'Cards & surfaces' },
  { id: 'callouts', label: 'Callouts' },
  { id: 'modals', label: 'Modals' },
  { id: 'filters', label: 'Filters & tabs' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'content', label: 'Content cards' },
  { id: 'links', label: 'Links & chips' },
];

export function UiShowcaseClient() {
  const { look, darkMode } = useTheme();
  const tokens = darkMode === 'dark' ? look.dark : look.light;

  const [toggleOn, setToggleOn] = useState(true);
  const [pill, setPill] = useState<'a' | 'b' | 'c'>('a');
  const [filter, setFilter] = useState<ContentFilterCategory>('all');
  const [progress, setProgress] = useState(65);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [destructiveOpen, setDestructiveOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteRevealed, setNoteRevealed] = useState(false);
  const [textInput, setTextInput] = useState('Sample input value');

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-16">
      <div className="space-y-4">
        <h1 className="font-display font-bold text-4xl text-text-primary">UI showcase</h1>
        <p className="font-body text-base text-text-primary max-w-3xl">
          Every reusable primitive and common pattern — toggle light/dark and looks in the header
          to verify contrast in each theme.
        </p>
        <nav className="flex flex-wrap gap-2 pt-2">
          {NAV_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="font-body text-sm font-semibold px-3 py-1.5 rounded-full bg-bg-subtle text-text-primary border border-border-subtle hover:border-brand hover:text-brand transition-colors"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>

      <Section
        id="theme"
        title="Theme controls"
        description="Same controls as the app header — switch look and light/dark mode to preview everything below."
      >
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border-subtle bg-bg-surface p-6">
          <ThemeToggle />
          <LooksSwitcher />
          <p className="font-body text-sm text-text-primary">
            Active: <strong>{look.name}</strong> · {darkMode} mode
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {tokenSwatches(tokens).map((entry) => (
            <Swatch
              key={entry.label}
              label={entry.label}
              color={entry.color}
              textColor={entry.pairedText}
            />
          ))}
        </div>

        <div className="rounded-lg border border-border-subtle bg-bg-subtle p-4 space-y-2">
          <p className="font-body text-sm font-semibold text-text-primary">Static Tailwind accents (not theme-swapped)</p>
          <div className="flex flex-wrap gap-3">
            {[
              ['success', '#2ECC71'],
              ['error', '#E74C3C'],
              ['warning', '#F39C12'],
              ['easy', '#27AE60'],
              ['medium', '#E67E22'],
              ['hard', '#E74C3C'],
            ].map(([name, hex]) => (
              <span
                key={name}
                className="font-body text-xs font-semibold px-3 py-1.5 rounded-md border border-border-subtle"
                style={{ color: hex as string, backgroundColor: `${hex}22` }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section id="typography" title="Typography">
        <div className="space-y-4 rounded-xl border border-border-subtle bg-bg-surface p-6">
          <p className="font-display font-bold text-4xl text-text-primary">Display 4xl — page titles</p>
          <p className="font-display font-bold text-2xl text-text-primary">Display 2xl — section headings</p>
          <p className="font-display font-bold text-lg text-text-primary">Display lg — card titles</p>
          <p className="font-body text-base text-text-primary">
            Body base — primary instructional copy. Use for anything the user must read.
          </p>
          <p className="font-body text-sm text-text-secondary">
            Body sm secondary — supporting context, not primary instructions.
          </p>
          <p className="font-body text-xs text-text-muted">Body xs muted — metadata, timestamps, labels.</p>
          <code className="font-mono text-sm text-text-primary bg-code-bg px-2 py-1 rounded">
            font-mono — code snippets
          </code>
        </div>
      </Section>

      <Section id="buttons" title="Buttons">
        <div className="flex flex-wrap gap-4 items-center">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section id="badges" title="Badges">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge type="difficulty" value="easy" />
            <Badge type="difficulty" value="intermediate" />
            <Badge type="difficulty" value="advanced" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge type="category" value="be" />
            <Badge type="category" value="fe" />
            <Badge type="category" value="nextjs" />
            <Badge type="category" value="fe-advanced" />
            <Badge type="category" value="stack-javascript" />
          </div>
          <span className="inline-flex bg-error-light text-error text-xs font-body font-bold px-2 py-0.5 rounded-full">
            🔥 Most Asked
          </span>
        </div>
      </Section>

      <Section id="forms" title="Form controls">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="font-body text-sm font-semibold text-text-primary">Toggle</p>
            <Toggle checked={toggleOn} onChange={setToggleOn} label="Demo toggle" />
          </div>
          <div className="space-y-4">
            <p className="font-body text-sm font-semibold text-text-primary">Pill toggle</p>
            <PillToggle
              options={[
                { value: 'a' as const, label: 'Option A' },
                { value: 'b' as const, label: 'Option B' },
                { value: 'c' as const, label: 'Option C' },
              ]}
              value={pill}
              onChange={setPill}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="demo-input" className="font-body text-sm font-semibold text-text-primary">
              Text input
            </label>
            <input
              id="demo-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full max-w-md font-body text-base text-text-primary bg-bg-subtle border border-border-subtle rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>
      </Section>

      <Section id="cards" title="Cards & surfaces">
        <div className="grid md:grid-cols-3 gap-6">
          <Card padding="sm">
            <p className="font-body text-sm text-text-primary">Card sm padding</p>
          </Card>
          <Card padding="md">
            <p className="font-body text-sm text-text-primary">Card md padding (default)</p>
          </Card>
          <Card padding="lg" className="shadow-raised">
            <p className="font-body text-sm text-text-primary">Card lg + shadow-raised</p>
          </Card>
        </div>
      </Section>

      <Section
        id="callouts"
        title="Callouts & banners"
        description="Status backgrounds use theme-aware CSS vars — always pair with text-text-primary for body copy."
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-brand-light border-l-4 border-brand p-5">
            <p className="font-body text-base font-semibold text-text-primary">Brand callout</p>
            <p className="font-body text-base text-text-primary mt-1">Tips, highlights, and onboarding notes.</p>
          </div>
          <div className="rounded-lg bg-success-light border border-success/30 p-5">
            <p className="font-body text-base font-semibold text-text-primary">Success callout</p>
            <p className="font-body text-base text-text-primary mt-1">Passed, completed, or correct.</p>
          </div>
          <div className="rounded-lg bg-error-light border border-error/30 p-5">
            <p className="font-body text-base font-semibold text-text-primary">Error callout</p>
            <p className="font-body text-base text-text-primary mt-1">Validation failures and blockers.</p>
          </div>
          <div className="rounded-lg bg-warning-light border-l-4 border-warning p-5">
            <p className="font-body text-base font-semibold text-text-primary">Warning callout</p>
            <p className="font-body text-base text-text-primary mt-1">Caution before destructive or hint actions.</p>
          </div>
          <div className="mb-4 bg-warning-light border border-warning rounded-md px-4 py-3 flex items-center gap-2">
            <span>⚠️</span>
            <p className="font-body text-sm font-semibold text-text-primary">Inline warning banner (challenge pattern)</p>
          </div>
          <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg bg-success-light border border-success/30">
            <p className="font-body text-sm font-semibold text-text-primary">✓ All tests passed</p>
            <Button className="px-4 py-2 text-sm">Continue</Button>
          </div>
          {noteRevealed ? (
            <RevealedNoteCard content="Your note: remember to use const for values that won't change." />
          ) : (
            <NoteHintBanner onViewNote={() => setNoteModalOpen(true)} />
          )}
        </div>
      </Section>

      <Section id="modals" title="Modals & dialogs">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setConfirmOpen(true)}>
            Confirm dialog
          </Button>
          <Button variant="secondary" onClick={() => setDestructiveOpen(true)}>
            Destructive confirm
          </Button>
          <Button variant="secondary" onClick={() => setAiModalOpen(true)}>
            AI confirmation modal
          </Button>
          <Button variant="secondary" onClick={() => setNoteModalOpen(true)}>
            Note hint modal
          </Button>
        </div>

        <ConfirmDialog
          open={confirmOpen}
          title="Save changes?"
          message="Your progress will be saved before continuing."
          confirmLabel="Save"
          onConfirm={() => setConfirmOpen(false)}
          onCancel={() => setConfirmOpen(false)}
        />
        <ConfirmDialog
          open={destructiveOpen}
          title="Reset module progress?"
          message="This will permanently erase step progress, review items, and hint history for this module."
          confirmLabel="Yes, reset module"
          destructive
          onConfirm={() => setDestructiveOpen(false)}
          onCancel={() => setDestructiveOpen(false)}
        />
        <AiConfirmationModal
          open={aiModalOpen}
          title="Use AI coach?"
          message="This will send your code to the AI for feedback. Each review counts toward your usage."
          confirmLabel="Ask AI"
          onConfirm={() => setAiModalOpen(false)}
          onCancel={() => setAiModalOpen(false)}
        />
        <NoteHintModal
          open={noteModalOpen}
          onClose={() => setNoteModalOpen(false)}
          onShowNote={() => {
            setNoteModalOpen(false);
            setNoteRevealed(true);
          }}
        />
      </Section>

      <Section id="filters" title="Filters & tabs">
        <FilterTabs active={filter} onChange={setFilter} />
        <p className="font-body text-sm text-text-muted">Active filter: {filter}</p>
      </Section>

      <Section id="feedback" title="Feedback & progress">
        <div className="flex flex-wrap items-center gap-8">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <ProgressRing progress={progress} />
          <div className="flex-1 min-w-[200px] space-y-2">
            <div className="h-2.5 rounded-full bg-bg-subtle overflow-hidden">
              <div
                className="h-full bg-brand transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full accent-brand"
              aria-label="Progress demo"
            />
          </div>
        </div>
      </Section>

      <Section id="content" title="Content cards">
        <div className="max-w-md">
          <ChallengeCard
            challenge={sampleChallenge}
            attemptCount={2}
            hasPassed={false}
            showMostAsked
          />
        </div>
      </Section>

      <Section id="links" title="Links & interactive chips">
        <div className="flex flex-wrap gap-4 items-center">
          <a href="#theme" className="font-body text-sm font-semibold text-brand hover:underline">
            Brand link
          </a>
          <button
            type="button"
            className="font-body text-sm font-semibold px-4 py-2 rounded-md bg-bg-subtle hover:bg-brand-light text-text-secondary hover:text-brand border border-border-subtle hover:border-brand/30 transition-all"
          >
            Secondary chip button
          </button>
          <button
            type="button"
            className={cn(
              'font-body text-sm font-semibold px-3 py-1.5 rounded-md border transition-colors',
              'text-error border-error/30 hover:border-error/50 bg-bg-surface'
            )}
          >
            Destructive text button
          </button>
        </div>
      </Section>
    </div>
  );
}
