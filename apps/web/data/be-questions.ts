import type { QuestionStub } from './types';

function createStub(
  id: string,
  title: string,
  category: 'be-question' | 'fe-question'
): QuestionStub {
  return {
    id,
    title,
    category,
    difficulty: 'medium',
    comingSoon: true,
  };
}

export const beQuestions: QuestionStub[] = Array.from({ length: 20 }, (_, i) =>
  createStub(
    `be-q-${String(i + 1).padStart(2, '0')}`,
    `Backend Concept ${i + 1}`,
    'be-question'
  )
);

export const feQuestions: QuestionStub[] = Array.from({ length: 20 }, (_, i) =>
  createStub(
    `fe-q-${String(i + 1).padStart(2, '0')}`,
    `Frontend Concept ${i + 1}`,
    'fe-question'
  )
);
