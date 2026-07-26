'use client';

import { useRightPanel, PANEL_WIDTH } from '@/components/providers/RightPanelProvider';
import { ConceptPanel } from '@/components/challenges/ConceptPanel';
import { AiChat } from '@/components/challenges/AiChat';
import { PlaybookAiChat } from '@/components/playbook/PlaybookAiChat';

export function RightPanel() {
  const { isOpen, activeTab, setActiveTab, activeConcept, challengeCtx, playbookCtx, close } = useRightPanel();

  return (
    <div
      className="fixed top-0 right-0 h-screen bg-bg-surface border-l-2 border-border-strong z-30 flex flex-col"
      style={{
        width: `${PANEL_WIDTH}px`,
        transform: isOpen ? 'translateX(0)' : `translateX(${PANEL_WIDTH}px)`,
        transition: 'transform 300ms ease',
      }}
    >
      {/* Header with tabs + close */}
      <div className="flex items-center border-b border-border-subtle flex-shrink-0 h-16">
        <div className="flex flex-1 h-full">
          {playbookCtx ? (
            <div className="flex-1 flex flex-col items-center justify-center px-3 py-2 border-b-2 border-brand min-w-0">
              <span className="font-body text-sm font-semibold text-brand truncate max-w-full">
                💬 Playbook AI Coach
              </span>
              <span className="font-body text-xs text-text-primary truncate max-w-full">
                {playbookCtx.intent === 'edit-subsection' && playbookCtx.currentSubsection
                  ? `${playbookCtx.currentSubsection} · ${playbookCtx.entryTitle}`
                  : playbookCtx.intent === 'edit-entry'
                    ? playbookCtx.entryTitle
                    : playbookCtx.intent === 'add-entry'
                      ? `New ${playbookCtx.categoryLabel} entry`
                      : playbookCtx.entryTitle}
              </span>
            </div>
          ) : (
            (
              [
                { id: 'concepts', label: '📖 Concepts' },
                { id: 'chat', label: '💬 Ask AI' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center font-body text-sm font-semibold transition-all duration-150 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-brand text-brand'
                    : 'border-transparent text-text-muted hover:text-text-primary hover:border-border-strong'
                }`}
              >
                {tab.label}
              </button>
            ))
          )}
        </div>

        {/* Close */}
        <button
          onClick={close}
          aria-label="Close panel"
          className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-subtle rounded-full transition-colors mx-2 flex-shrink-0"
        >
          ✕
        </button>
      </div>

      {/* Tab content — both panels stay mounted so chat history survives tab switches */}
      <div className="flex-1 min-h-0 relative">
        {/* Concepts tab */}
        <div className={`absolute inset-0 overflow-y-auto ${activeTab === 'concepts' ? '' : 'hidden'}`}>
          <div className="p-6">
            {activeConcept && (
              <h2 className="font-display text-lg font-bold text-text-primary mb-6">
                {activeConcept}
              </h2>
            )}
            <ConceptPanel
              concept={activeConcept}
              challengeTitle={challengeCtx?.title ?? ''}
            />
          </div>
        </div>

        {/* Chat tab */}
        <div className={`absolute inset-0 flex flex-col ${activeTab === 'chat' ? '' : 'hidden'}`}>
          {!challengeCtx && !playbookCtx ? (
            <div className="flex flex-col items-center justify-center h-48 text-center px-6">
              <p className="text-4xl mb-3">💬</p>
              <p className="font-body text-sm text-text-secondary">
                Open a challenge or Playbook entry to start chatting with the AI coach.
              </p>
            </div>
          ) : playbookCtx ? (
            <PlaybookAiChat />
          ) : (
            <AiChat />
          )}
        </div>
      </div>

      {/* Footer — concepts tab only */}
      {activeTab === 'concepts' && (
        <div className="flex-shrink-0 px-6 py-3 border-t border-border-subtle bg-bg-surface">
          <p className="font-body text-xs text-text-muted">
            📚 Viewing resources is encouraged — looking up syntax is what real engineers do.
          </p>
        </div>
      )}
    </div>
  );
}
