import { describe, it, expect } from 'vitest';
import { gradeAnswer, type ConceptualQuestion } from '@/data/types';

function makeQuestion(overrides: Partial<ConceptualQuestion> = {}): ConceptualQuestion {
  return {
    id: 'test-q',
    category: 'be-question',
    question: 'Explain the event loop',
    difficulty: 'intermediate',
    concepts: ['event-loop'],
    modelAnswer: 'The event loop uses a call stack and callback queue.',
    keyTerms: ['call stack', 'event loop', 'callback queue', 'async'],
    passingThreshold: 0.6,
    mostAsked: false,
    ...overrides,
  };
}

describe('Keyword Grading', () => {
  it('passes when enough key terms are present', () => {
    const result = gradeAnswer(
      'The event loop uses a call stack and a callback queue to handle async operations',
      makeQuestion()
    );
    expect(result.passed).toBe(true);
    expect(result.matchedTerms.length).toBeGreaterThanOrEqual(3);
  });

  it('fails when too few key terms are present', () => {
    const result = gradeAnswer(
      'JavaScript runs code',
      makeQuestion({
        keyTerms: ['call stack', 'event loop', 'callback queue', 'microtask'],
        passingThreshold: 0.6,
      })
    );
    expect(result.passed).toBe(false);
  });

  it('is case insensitive', () => {
    const result = gradeAnswer(
      'THE CALL STACK handles synchronous code',
      makeQuestion({ keyTerms: ['call stack'], passingThreshold: 1.0 })
    );
    expect(result.passed).toBe(true);
  });

  it('passes at exactly the threshold', () => {
    const result = gradeAnswer(
      'event loop and call stack',
      makeQuestion({
        keyTerms: ['event loop', 'call stack', 'microtask', 'libuv'],
        passingThreshold: 0.5,
      })
    );
    expect(result.score).toBe(0.5);
    expect(result.passed).toBe(true);
  });

  it('returns matched terms list', () => {
    const result = gradeAnswer(
      'The call stack is important',
      makeQuestion({ keyTerms: ['call stack', 'event loop'] })
    );
    expect(result.matchedTerms).toEqual(['call stack']);
  });

  it('handles empty answer', () => {
    const result = gradeAnswer('', makeQuestion());
    expect(result.passed).toBe(false);
    expect(result.score).toBe(0);
  });
});
