'use client';
import { createContext, useCallback, useContext, useRef, useState } from 'react';

export type RightPanelTab = 'concepts' | 'chat';

export interface ChallengeCtx {
  challengeId: string;
  title: string;
  description: string;
  currentCode: string;
  language: string;
}

interface RightPanelContextValue {
  isOpen: boolean;
  activeTab: RightPanelTab;
  activeConcept: string | null;
  challengeCtx: ChallengeCtx | null;
  sidebarCollapsed: boolean;
  pendingMessage: string | null;
  clearPendingMessage: () => void;
  openConcepts: (concept: string) => void;
  openChat: (initialMessage?: string) => void;
  close: () => void;
  setActiveTab: (tab: RightPanelTab) => void;
  setChallengeCtx: (ctx: ChallengeCtx) => void;
  toggleSidebar: () => void;
}

export const PANEL_WIDTH = 440;
const COLLAPSED_SIDEBAR = '4rem';
const EXPANDED_SIDEBAR = '16rem';

const RightPanelContext = createContext<RightPanelContextValue>({
  isOpen: false,
  activeTab: 'concepts',
  activeConcept: null,
  challengeCtx: null,
  sidebarCollapsed: false,
  pendingMessage: null,
  clearPendingMessage: () => {},
  openConcepts: () => {},
  openChat: () => {},
  close: () => {},
  setActiveTab: () => {},
  setChallengeCtx: () => {},
  toggleSidebar: () => {},
});

function setVar(name: string, value: string) {
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty(name, value);
  }
}

export function RightPanelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTabState] = useState<RightPanelTab>('concepts');
  const [activeConcept, setActiveConcept] = useState<string | null>(null);
  const [challengeCtx, setChallengeCtxState] = useState<ChallengeCtx | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const autoCollapsedRef = useRef(false);

  const collapseSidebarIfNeeded = useCallback(() => {
    // Always collapse sidebar when panel opens to maximise content area
    setSidebarCollapsed(true);
    setVar('--sidebar-width', COLLAPSED_SIDEBAR);
    autoCollapsedRef.current = true;
  }, []);

  const restoreSidebar = useCallback(() => {
    if (autoCollapsedRef.current) {
      setSidebarCollapsed(false);
      setVar('--sidebar-width', EXPANDED_SIDEBAR);
      autoCollapsedRef.current = false;
    }
  }, []);

  const openConcepts = useCallback(
    (concept: string) => {
      setActiveConcept(concept);
      setActiveTabState('concepts');
      setIsOpen(true);
      setVar('--right-panel-width', `${PANEL_WIDTH}px`);
      collapseSidebarIfNeeded();
    },
    [collapseSidebarIfNeeded]
  );

  const openChat = useCallback(
    (initialMessage?: string) => {
      setActiveTabState('chat');
      setIsOpen(true);
      if (initialMessage) setPendingMessage(initialMessage);
      setVar('--right-panel-width', `${PANEL_WIDTH}px`);
      collapseSidebarIfNeeded();
    },
    [collapseSidebarIfNeeded]
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setVar('--right-panel-width', '0px');
    restoreSidebar();
  }, [restoreSidebar]);

  const setActiveTab = useCallback((tab: RightPanelTab) => {
    setActiveTabState(tab);
  }, []);

  const setChallengeCtx = useCallback((ctx: ChallengeCtx) => {
    setChallengeCtxState(ctx);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      setVar('--sidebar-width', next ? COLLAPSED_SIDEBAR : EXPANDED_SIDEBAR);
      autoCollapsedRef.current = false;
      return next;
    });
  }, []);

  const clearPendingMessage = useCallback(() => setPendingMessage(null), []);

  return (
    <RightPanelContext.Provider
      value={{
        isOpen,
        activeTab,
        activeConcept,
        challengeCtx,
        sidebarCollapsed,
        pendingMessage,
        clearPendingMessage,
        openConcepts,
        openChat,
        close,
        setActiveTab,
        setChallengeCtx,
        toggleSidebar,
      }}
    >
      {children}
    </RightPanelContext.Provider>
  );
}

export const useRightPanel = () => useContext(RightPanelContext);
