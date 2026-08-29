'use client';

import { PathMap } from '@/components/learn/PathMap';
import type { LearnGraphNode } from '@/data/learn/graph';
import type { ModuleProgressView } from '@/data/learn/types';

interface PathMapClientProps {
  initialData: {
    trackId: string;
    title: string;
    levelLabels: Record<number, string>;
    nodes: LearnGraphNode[];
    moduleProgress: ModuleProgressView[];
    stats: {
      completed: number;
      available: number;
      total: number;
      reviewDueCount: number;
    };
  };
}

export function PathMapClient({ initialData }: PathMapClientProps) {
  return (
    <PathMap
      nodes={initialData.nodes}
      moduleProgress={initialData.moduleProgress}
      stats={initialData.stats}
    />
  );
}
