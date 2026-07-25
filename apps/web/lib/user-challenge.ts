import type { UserChallenge } from '@prisma/client';
import type { Challenge, ChallengeCategory, ChallengeDifficulty, ChallengeLanguage } from '@/data/types';
import { validateUserChallenge } from '@/lib/user-challenge-validator';

export type UserChallengeRecord = UserChallenge;

export function userChallengeToChallenge(record: UserChallengeRecord): Challenge {
  const category = record.category as ChallengeCategory;
  const difficulty = record.difficulty as ChallengeDifficulty;

  return {
    id: record.id,
    title: record.title,
    category,
    difficulty,
    comingSoon: false,
    description: record.description,
    concepts: record.concepts,
    hints: [],
    starterCode: {
      javascript: record.starterCodeJs,
      typescript: record.starterCodeTs,
    },
    solution: {
      javascript: record.solutionJs,
      typescript: record.solutionTs,
    },
    validate: (userCode: string, language: ChallengeLanguage) => {
      const solutionCode =
        language === 'typescript' ? record.solutionTs : record.solutionJs;
      return validateUserChallenge(userCode, solutionCode, language);
    },
    mostAsked: false,
    hasLivePreview: false,
  };
}

export interface GeneratedChallengePayload {
  title: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  description: string;
  concepts: string[];
  starterCodeJs: string;
  starterCodeTs: string;
  solutionJs: string;
  solutionTs: string;
  lessonContent: string;
  miniChallengePrompt: string;
  difficulty_reasoning?: string;
}

export const GENERATE_CHALLENGE_SYSTEM_PROMPT = `You are a senior engineering educator building interview prep challenges.

The user has described a real technical interview challenge they encountered. Your job is to generate a complete, high-quality practice challenge from their description.

CRITICAL: Your entire response must be ONE valid JSON object. No markdown fences. No text before or after the JSON.

Use proper JSON escaping in all string values:
- Use \\n for line breaks inside code and markdown strings (never literal newlines inside JSON strings)
- Escape double quotes inside strings as \\"
- Keep starterCodeJs, starterCodeTs, solutionJs, solutionTs concise (under 40 lines each)

Generate a JSON object with EXACTLY this structure:

{
  "title": "Clear, specific challenge title",
  "category": "be",
  "difficulty": "intermediate",
  "description": "Full challenge description in markdown...",
  "concepts": ["concept1", "concept2", "concept3"],
  "starterCodeJs": "// JS starter with \\n escaped newlines",
  "starterCodeTs": "// TS starter with \\n escaped newlines",
  "solutionJs": "// complete JS solution",
  "solutionTs": "// complete TS solution",
  "lessonContent": "A 300-450 word markdown lesson...",
  "miniChallengePrompt": "A simpler warm-up challenge (2-3 sentences).",
  "difficulty_reasoning": "One sentence explaining the difficulty level."
}

Field rules:
- category must be exactly one of: "be", "fe", "fe-advanced"
- difficulty must be exactly one of: "easy", "intermediate", "advanced"
- The challenge must be solvable in under 15 minutes by a senior engineer
- Starter code must be syntactically correct; export the main function(s) for testing
- Be specific to what the user described — do not generalize
- Respond with ONLY the JSON object — nothing else`;
