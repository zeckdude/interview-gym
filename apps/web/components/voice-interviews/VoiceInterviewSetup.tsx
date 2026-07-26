'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { PillToggle } from '@/components/ui/PillToggle';
import { Spinner } from '@/components/ui/Spinner';
import { PLAYBOOK_CATEGORIES, type PlaybookCategoryId } from '@/lib/playbook/categories';
import { SIMULATOR_PRESETS } from '@/lib/playbook/simulator-presets';

const PLAYBOOK_LAUNCH_STORAGE_KEY = 'playbook-simulator-launch';

type Difficulty = 'easy' | 'intermediate' | 'advanced' | 'mixed';
type SessionLength = 3 | 5 | 10;
type InterviewType = 'voice' | 'text' | 'mixed';

interface InterviewerForm {
  id: string;
  name: string;
  title: string;
  linkedInUrl: string;
  linkedInText: string;
  rapportPoints: string[];
  researched: boolean;
}

interface RapportCard {
  name: string;
  title: string | null;
  rapportPoints: string[];
}

export function VoiceInterviewSetup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedQuestion = searchParams.get('questionId');
  const isReview = searchParams.get('review') === '1';
  const fromPlaybook = searchParams.get('playbook') === 'true';
  const playbookQuestions = useMemo(() => {
    if (fromPlaybook && typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(PLAYBOOK_LAUNCH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as { questions?: string[] };
          if (parsed.questions?.length) return parsed.questions;
        }
      } catch {
        /* fall through to URL param */
      }
    }

    const raw = searchParams.get('questions');
    if (!raw) return [] as string[];
    try {
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  }, [fromPlaybook, searchParams]);

  const [selectedCategories, setSelectedCategories] = useState<Set<PlaybookCategoryId>>(
    () => new Set<PlaybookCategoryId>(['story', 'values'])
  );
  const [difficulty, setDifficulty] = useState<Difficulty>('mixed');
  const [sessionLength, setSessionLength] = useState<SessionLength>(5);
  const [interviewType, setInterviewType] = useState<InterviewType>('voice');
  const [includeFollowUps, setIncludeFollowUps] = useState(true);
  const [mostAskedOnly, setMostAskedOnly] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [jobListingUrl, setJobListingUrl] = useState('');
  const [jobListingText, setJobListingText] = useState('');
  const [companyNotes, setCompanyNotes] = useState('');
  const [companyContextId, setCompanyContextId] = useState<string | null>(null);
  const [researchSummary, setResearchSummary] = useState<string | null>(null);
  const [researchingCompany, setResearchingCompany] = useState(false);

  const [interviewers, setInterviewers] = useState<InterviewerForm[]>([]);
  const [rapportCards, setRapportCards] = useState<RapportCard[]>([]);
  const [showRapportPrep, setShowRapportPrep] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fromPlaybook && playbookQuestions.length > 0) {
      setSessionLength(Math.min(10, Math.max(3, playbookQuestions.length)) as SessionLength);
    }
  }, [fromPlaybook, playbookQuestions]);

  const applyPreset = (presetId: string) => {
    const preset = SIMULATOR_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePreset(presetId);
    setSelectedCategories(new Set(preset.categories));
    setDifficulty(preset.difficulty);
    setSessionLength(preset.questionCount as SessionLength);
    setIncludeFollowUps(preset.includeFollowUps);
  };

  const toggleCategory = (id: PlaybookCategoryId) => {
    setActivePreset(null);
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const researchCompany = async () => {
    setResearchingCompany(true);
    setError(null);
    try {
      const res = await fetch('/api/simulator/research-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          companyWebsite,
          jobListingUrl,
          jobListingText,
          additionalNotes: companyNotes,
          contextId: companyContextId ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Research failed');
        return;
      }
      setCompanyContextId(data.contextId);
      setResearchSummary(data.researchSummary);
    } catch {
      setError('Company research failed');
    } finally {
      setResearchingCompany(false);
    }
  };

  const addInterviewer = () => {
    setInterviewers((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        name: '',
        title: '',
        linkedInUrl: '',
        linkedInText: '',
        rapportPoints: [],
        researched: false,
      },
    ]);
  };

  const researchInterviewer = async (index: number) => {
    if (!companyContextId) {
      setError('Research the company first to save interviewer context');
      return;
    }
    const iv = interviewers[index];
    if (!iv.name.trim()) {
      setError('Enter interviewer name');
      return;
    }
    setError(null);
    try {
      const res = await fetch('/api/simulator/research-interviewer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contextId: companyContextId,
          name: iv.name,
          title: iv.title,
          linkedInUrl: iv.linkedInUrl,
          linkedInText: iv.linkedInText,
          companyName,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Interviewer research failed');
        return;
      }
      setInterviewers((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                rapportPoints: data.interviewer.rapportPoints ?? [],
                researched: true,
              }
            : item
        )
      );
    } catch {
      setError('Interviewer research failed');
    }
  };

  const handleStart = async () => {
    const researchedInterviewers = interviewers.filter((i) => i.researched && i.rapportPoints.length);
    if (researchedInterviewers.length > 0 && !showRapportPrep) {
      setRapportCards(
        researchedInterviewers.map((i) => ({
          name: i.name,
          title: i.title || null,
          rapportPoints: i.rapportPoints,
        }))
      );
      setShowRapportPrep(true);
      return;
    }

    if (fromPlaybook && playbookQuestions.length === 0) {
      setError('No playbook questions found. Return to My Playbook and launch again.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const questionCount = fromPlaybook
        ? playbookQuestions.length
        : sessionLength;

      const res = await fetch('/api/voice-interviews/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'playbook',
          difficulty,
          sessionQuestionCount: questionCount,
          includeFollowUps,
          mostAskedOnly,
          questionId: preselectedQuestion ?? undefined,
          playbookCategories: fromPlaybook ? undefined : Array.from(selectedCategories),
          presetId: activePreset,
          interviewType,
          companyContextId,
          customQuestionTexts: fromPlaybook ? playbookQuestions : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to start session');
        return;
      }
      router.push(`/simulator/voice/${data.sessionId}`);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showRapportPrep) {
    return (
      <div className="space-y-6 max-w-2xl">
        <h1 className="font-display font-bold text-2xl text-text-primary">🤝 Rapport Prep</h1>
        {rapportCards.map((card) => (
          <div
            key={card.name}
            className="bg-bg-surface rounded-xl shadow-card p-6 space-y-3 border border-border-subtle"
          >
            <h2 className="font-display font-semibold text-lg text-text-primary">
              {card.name}{card.title ? `, ${card.title}` : ''}
            </h2>
            <ul className="space-y-2">
              {card.rapportPoints.map((point) => (
                <li key={point} className="font-body text-base text-text-primary">
                  • {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <Button onClick={() => void handleStart()} disabled={loading} className="w-full">
          {loading ? 'Starting…' : 'Got it, start the session →'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="space-y-3">
        <h1 className="font-display font-bold text-3xl text-text-primary">
          Interview Simulator 🎯
        </h1>
        <p className="font-body text-base text-text-primary leading-relaxed">
          Practice behavioral and technical interviews with AI coaching tailored to your job search goals.
        </p>
      </div>

      {fromPlaybook && playbookQuestions.length > 0 && (
        <div className="bg-brand-light border-l-4 border-brand rounded-r-md p-4">
          <p className="font-body text-base text-text-primary font-semibold">
            Launching from My Playbook — {playbookQuestions.length} hand-picked question
            {playbookQuestions.length === 1 ? '' : 's'}
          </p>
        </div>
      )}

      {isReview && preselectedQuestion && (
        <div className="bg-warning-light border-l-4 border-warning rounded-r-md p-4">
          <p className="font-body text-base text-text-primary font-semibold">
            Review session — practicing a question from your queue
          </p>
        </div>
      )}

      <div className="bg-bg-surface rounded-xl shadow-card p-6 space-y-8">
        {!preselectedQuestion && !fromPlaybook && (
          <>
            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-text-primary">
                Quick Start — Interview Round Presets
              </h2>
              <div className="flex flex-wrap gap-2">
                {SIMULATOR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset.id)}
                    className={`px-4 py-3 rounded-lg font-body text-sm font-medium text-left border transition-all ${
                      activePreset === preset.id
                        ? 'bg-brand text-white border-brand shadow-brand'
                        : 'bg-bg-subtle text-text-primary border-border-subtle hover:border-brand'
                    }`}
                  >
                    <span className="block font-semibold">{preset.icon} {preset.label}</span>
                    <span className={`block text-xs mt-1 ${activePreset === preset.id ? 'text-white/90' : 'text-text-muted'}`}>
                      {preset.description}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-text-primary">
                Question Categories (pick one or more)
              </h2>
              <div className="flex flex-wrap gap-2">
                {PLAYBOOK_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-2 rounded-full font-body text-sm font-medium transition-all ${
                      selectedCategories.has(cat.id)
                        ? 'bg-brand text-white shadow-brand'
                        : 'bg-bg-subtle text-text-primary border border-border-subtle hover:border-brand'
                    }`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-text-primary">Interview Type</h2>
              <PillToggle
                options={[
                  { value: 'voice' as const, label: '🎙️ Voice' },
                  { value: 'text' as const, label: '💬 Text' },
                  { value: 'mixed' as const, label: 'Mixed' },
                ]}
                value={interviewType}
                onChange={setInterviewType}
              />
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-text-primary">Difficulty</h2>
              <PillToggle
                options={[
                  { value: 'easy' as const, label: 'Easy' },
                  { value: 'intermediate' as const, label: 'Intermediate' },
                  { value: 'advanced' as const, label: 'Advanced' },
                  { value: 'mixed' as const, label: 'Mixed' },
                ]}
                value={difficulty}
                onChange={setDifficulty}
              />
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-text-primary">Session Length</h2>
              <PillToggle
                options={[
                  { value: 3 as const, label: '3 Questions' },
                  { value: 5 as const, label: '5 Questions' },
                  { value: 10 as const, label: '10 Questions' },
                ]}
                value={sessionLength}
                onChange={setSessionLength}
              />
            </section>

            <section className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeFollowUps}
                  onChange={(e) => setIncludeFollowUps(e.target.checked)}
                  className="w-5 h-5 rounded border-border-subtle text-brand focus:ring-brand"
                />
                <span className="font-body text-base text-text-primary">
                  Include follow-up and challenge questions
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mostAskedOnly}
                  onChange={(e) => setMostAskedOnly(e.target.checked)}
                  className="w-5 h-5 rounded border-border-subtle text-brand focus:ring-brand"
                />
                <span className="font-body text-base text-text-primary">
                  🔥 Most Asked questions only
                </span>
              </label>
            </section>
          </>
        )}

        <section className="space-y-4 border-t border-border-subtle pt-6">
          <h2 className="font-display font-semibold text-lg text-text-primary">
            The Company (optional)
          </h2>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company name"
            className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary"
          />
          <input
            value={companyWebsite}
            onChange={(e) => setCompanyWebsite(e.target.value)}
            placeholder="Company website (https://...)"
            className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary"
          />
          <input
            value={jobListingUrl}
            onChange={(e) => setJobListingUrl(e.target.value)}
            placeholder="Job listing URL"
            className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary"
          />
          <textarea
            value={jobListingText}
            onChange={(e) => setJobListingText(e.target.value)}
            placeholder="Or paste job listing text"
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary"
          />
          <textarea
            value={companyNotes}
            onChange={(e) => setCompanyNotes(e.target.value)}
            placeholder="Additional notes"
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary"
          />
          <Button
            variant="secondary"
            onClick={() => void researchCompany()}
            disabled={researchingCompany}
          >
            {researchingCompany ? 'Researching…' : '🔍 Research This Company'}
          </Button>
          {researchSummary && (
            <div className="bg-info-light border-l-4 border-info rounded-r-md p-4 max-h-48 overflow-y-auto">
              <p className="font-body text-sm text-text-primary whitespace-pre-wrap">{researchSummary}</p>
            </div>
          )}
        </section>

        <section className="space-y-4 border-t border-border-subtle pt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-text-primary">
              Interviewers (optional)
            </h2>
            <Button variant="secondary" onClick={addInterviewer}>
              + Add Interviewer
            </Button>
          </div>
          {interviewers.map((iv, index) => (
            <div key={iv.id} className="border border-border-subtle rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={iv.name}
                  onChange={(e) =>
                    setInterviewers((prev) =>
                      prev.map((item, i) => (i === index ? { ...item, name: e.target.value } : item))
                    )
                  }
                  placeholder="Name"
                  className="px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-sm text-text-primary"
                />
                <input
                  value={iv.title}
                  onChange={(e) =>
                    setInterviewers((prev) =>
                      prev.map((item, i) => (i === index ? { ...item, title: e.target.value } : item))
                    )
                  }
                  placeholder="Title"
                  className="px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-sm text-text-primary"
                />
              </div>
              <input
                value={iv.linkedInUrl}
                onChange={(e) =>
                  setInterviewers((prev) =>
                    prev.map((item, i) => (i === index ? { ...item, linkedInUrl: e.target.value } : item))
                  )
                }
                placeholder="LinkedIn URL"
                className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-sm text-text-primary"
              />
              <textarea
                value={iv.linkedInText}
                onChange={(e) =>
                  setInterviewers((prev) =>
                    prev.map((item, i) => (i === index ? { ...item, linkedInText: e.target.value } : item))
                  )
                }
                placeholder="Paste LinkedIn text (optional)"
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-sm text-text-primary"
              />
              <Button variant="secondary" onClick={() => void researchInterviewer(index)}>
                🔍 Research This Person
              </Button>
            </div>
          ))}
        </section>

        {error && (
          <p className="font-body text-sm text-error bg-error-light border border-error/20 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <Button onClick={() => void handleStart()} disabled={loading} className="w-full">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size="sm" /> Starting…
              </span>
            ) : (
              'Start Session →'
            )}
          </Button>
          <Link
            href="/simulator/voice/history"
            className="font-body text-sm text-brand hover:underline text-center"
          >
            View Past Sessions →
          </Link>
        </div>
      </div>
    </div>
  );
}
