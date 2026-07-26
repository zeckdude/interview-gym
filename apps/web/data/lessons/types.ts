import type {
  ChallengeCategory,
  ChallengeDifficulty,
  ContentSubcategory,
  TopLevelCategory,
} from '@/data/types';

export interface LessonStep {
  type: 'explanation' | 'code-example' | 'gotcha' | 'mini-challenge';
  title?: string;
  content: string;
  language?: 'javascript' | 'typescript';
}

export interface MiniChallengeResult {
  passed: boolean;
  feedback: string;
}

export interface MiniChallenge {
  id: string;
  prompt: string;
  timeLimitSeconds: number;
  starterCode: {
    javascript: string;
    typescript: string;
  };
  solution: {
    javascript: string;
    typescript: string;
  };
  validate: (userCode: string) => MiniChallengeResult | Promise<MiniChallengeResult>;
}

export interface Lesson {
  id: string;
  title: string;
  /** @deprecated Use topLevel/subcategory when authoring new content. Kept for migration. */
  category: ChallengeCategory;
  topLevel?: TopLevelCategory;
  subcategory?: ContentSubcategory | null;
  difficulty: ChallengeDifficulty;
  /** Agent-curated interview frequency flag — defaults to false when omitted. */
  mostAsked?: boolean;
  mostAskedReason?: string;
  relatedChallengeIds: string[];
  estimatedMinutes: number;
  concepts: string[];
  steps: LessonStep[];
  miniChallenge: MiniChallenge;
  mdnLinks: { label: string; url: string }[];
}

export type LessonFilterCategory = 'all' | ChallengeCategory;

export interface LessonProgressRecord {
  lessonId: string;
  completed: boolean;
  miniChallengePassed: boolean;
  bestTimeMs: number | null;
  attempts: number;
  lastAttemptAt: string | null;
}
