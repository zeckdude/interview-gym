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

export type ChallengeCategory = 'be' | 'fe' | 'fe-advanced';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';
export type ChallengeLanguage = 'javascript' | 'typescript';

export interface Challenge {
  id: string;
  title: string;
  category: ChallengeCategory;
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
}

export interface QuestionStub {
  id: string;
  title: string;
  category: 'be-question' | 'fe-question';
  difficulty: ChallengeDifficulty;
  comingSoon: boolean;
}

export type FilterCategory = 'all' | 'be' | 'fe' | 'fe-advanced';
