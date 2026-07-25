export interface TestResult {
  description: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export interface ValidationResult {
  passed: boolean;
  results: TestResult[];
}

/** Legacy stored category on challenges/lessons — prefer explicit taxonomy when set. */
export type ChallengeCategory = 'be' | 'fe' | 'fe-advanced' | 'nextjs';

export type TopLevelCategory = 'be' | 'fe' | 'stack';

export type ContentSubcategory =
  | 'react'
  | 'nextjs'
  | 'css'
  | 'ai'
  | 'typescript'
  | 'vitest';

export interface ContentTaxonomy {
  topLevel: TopLevelCategory;
  /** null = general content for the top level (no subcategory label in UI). */
  subcategory: ContentSubcategory | null;
}

/** URL / list filter for top-level tabs. */
export type TopLevelFilter = 'all' | TopLevelCategory;

export type ChallengeDifficulty = 'easy' | 'intermediate' | 'advanced';
export type ChallengeLanguage = 'javascript' | 'typescript';
export type SandpackTemplate = 'react' | 'react-ts' | 'nextjs';

export interface Challenge {
  id: string;
  title: string;
  /** @deprecated Use topLevel/subcategory when authoring new content. Kept for migration. */
  category: ChallengeCategory;
  /** Explicit taxonomy — overrides legacy `category` when both are set. */
  topLevel?: TopLevelCategory;
  subcategory?: ContentSubcategory | null;
  difficulty: ChallengeDifficulty;
  comingSoon: boolean;
  description: string;
  concepts: string[];
  hints: string[];
  starterCode: {
    javascript: string;
    typescript: string;
  };
  solution: {
    javascript: string;
    typescript: string;
  };
  validate: (
    userCode: string,
    language: ChallengeLanguage
  ) => ValidationResult | Promise<ValidationResult>;
  /** Commonly appears in real senior interviews */
  mostAsked: boolean;
  /** Optional reason shown in UI for most-asked items */
  mostAskedReason?: string;
  /** Show Sandpack live preview for React/Next.js visual challenges */
  hasLivePreview: boolean;
  sandpackTemplate?: SandpackTemplate;
  sandpackFiles?: Record<string, string>;
}

export type LegacyQuestionCategory = 'be-question' | 'fe-question' | 'nextjs-question';

export interface QuestionStub {
  id: string;
  title: string;
  category: LegacyQuestionCategory;
  difficulty: ChallengeDifficulty;
  comingSoon: boolean;
}

/** @deprecated Use TopLevelFilter + ContentSubcategory[] in Phase 2+. */
export type FilterCategory = 'all' | 'be' | 'frontend' | 'react' | 'nextjs';

export interface ConceptualQuestion {
  id: string;
  category: LegacyQuestionCategory;
  topLevel?: TopLevelCategory;
  subcategory?: ContentSubcategory | null;
  question: string;
  difficulty: ChallengeDifficulty;
  concepts: string[];
  modelAnswer: string;
  keyTerms: string[];
  passingThreshold: number;
  mostAsked: boolean;
  mostAskedReason?: string;
}

export function gradeAnswer(
  userAnswer: string,
  question: ConceptualQuestion
): { passed: boolean; matchedTerms: string[]; score: number } {
  const lower = userAnswer.toLowerCase();
  const matchedTerms = question.keyTerms.filter((term) =>
    lower.includes(term.toLowerCase())
  );
  const score = matchedTerms.length / question.keyTerms.length;
  return {
    passed: score >= question.passingThreshold,
    matchedTerms,
    score,
  };
}
