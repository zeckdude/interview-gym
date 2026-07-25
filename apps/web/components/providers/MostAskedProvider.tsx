'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '@clerk/nextjs';
import {
  mostAskedOverrideKey,
  overridesMapFromRecords,
  resolveEffectiveMostAsked,
  type CuratedMostAsked,
  type MostAskedItemType,
} from '@/lib/most-asked';

interface MostAskedContextValue {
  loaded: boolean;
  getOverride: (itemType: MostAskedItemType, itemId: string) => boolean | undefined;
  hasOverride: (itemType: MostAskedItemType, itemId: string) => boolean;
  getEffective: (
    itemType: MostAskedItemType,
    itemId: string,
    curated: CuratedMostAsked
  ) => CuratedMostAsked & { isPersonalOverride: boolean };
  setMostAsked: (
    itemType: MostAskedItemType,
    itemId: string,
    mostAsked: boolean
  ) => Promise<void>;
  resetMostAsked: (itemType: MostAskedItemType, itemId: string) => Promise<void>;
}

const MostAskedContext = createContext<MostAskedContextValue | null>(null);

export function MostAskedProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isSignedIn) {
      setOverrides({});
      setLoaded(true);
      return;
    }

    let cancelled = false;

    async function loadOverrides() {
      try {
        const res = await fetch('/api/most-asked/overrides');
        if (!res.ok) {
          if (!cancelled) setLoaded(true);
          return;
        }
        const data = (await res.json()) as {
          overrides: Array<{ itemType: MostAskedItemType; itemId: string; mostAsked: boolean }>;
        };
        if (!cancelled) {
          setOverrides(overridesMapFromRecords(data.overrides));
          setLoaded(true);
        }
      } catch {
        if (!cancelled) setLoaded(true);
      }
    }

    setLoaded(false);
    loadOverrides();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  const getOverride = useCallback(
    (itemType: MostAskedItemType, itemId: string) => {
      return overrides[mostAskedOverrideKey(itemType, itemId)];
    },
    [overrides]
  );

  const hasOverride = useCallback(
    (itemType: MostAskedItemType, itemId: string) => {
      return mostAskedOverrideKey(itemType, itemId) in overrides;
    },
    [overrides]
  );

  const getEffective = useCallback(
    (itemType: MostAskedItemType, itemId: string, curated: CuratedMostAsked) => {
      return resolveEffectiveMostAsked(curated, getOverride(itemType, itemId));
    },
    [getOverride]
  );

  const setMostAsked = useCallback(
    async (itemType: MostAskedItemType, itemId: string, mostAsked: boolean) => {
      const key = mostAskedOverrideKey(itemType, itemId);
      setOverrides((current) => ({ ...current, [key]: mostAsked }));

      try {
        const res = await fetch('/api/most-asked/overrides', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemType, itemId, mostAsked }),
        });
        if (!res.ok) {
          setOverrides((current) => {
            const next = { ...current };
            delete next[key];
            return next;
          });
        }
      } catch {
        setOverrides((current) => {
          const next = { ...current };
          delete next[key];
          return next;
        });
      }
    },
    []
  );

  const resetMostAsked = useCallback(async (itemType: MostAskedItemType, itemId: string) => {
    const key = mostAskedOverrideKey(itemType, itemId);
    const previous = overrides[key];
    setOverrides((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });

    try {
      const res = await fetch('/api/most-asked/overrides', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemType, itemId }),
      });
      if (!res.ok && previous !== undefined) {
        setOverrides((current) => ({ ...current, [key]: previous }));
      }
    } catch {
      if (previous !== undefined) {
        setOverrides((current) => ({ ...current, [key]: previous }));
      }
    }
  }, [overrides]);

  const value = useMemo(
    () => ({
      loaded,
      getOverride,
      hasOverride,
      getEffective,
      setMostAsked,
      resetMostAsked,
    }),
    [loaded, getOverride, hasOverride, getEffective, setMostAsked, resetMostAsked]
  );

  return <MostAskedContext.Provider value={value}>{children}</MostAskedContext.Provider>;
}

export function useMostAsked() {
  const context = useContext(MostAskedContext);
  if (!context) {
    throw new Error('useMostAsked must be used within MostAskedProvider');
  }
  return context;
}

export function useMostAskedOptional() {
  return useContext(MostAskedContext);
}
