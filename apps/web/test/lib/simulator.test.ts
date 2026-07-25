import { describe, it, expect, vi } from 'vitest';
import {
  calculateSessionScore,
  selectSimulatorChallenges,
  formatDurationMs,
  getScoreMessage,
  getCategoryLabel,
} from '@/lib/simulator';

describe('Simulator Scoring', () => {
  it('returns 100 for all passed challenges with fast times', () => {
    const challenges = [
      { passed: true, timeSpentMs: 120000 },
      { passed: true, timeSpentMs: 180000 },
      { passed: true, timeSpentMs: 90000 },
    ];
    const score = calculateSessionScore(challenges);
    expect(score).toBe(100);
  });

  it('returns 0 for all failed challenges', () => {
    const challenges = [
      { passed: false, timeSpentMs: 600000 },
      { passed: false, timeSpentMs: 600000 },
    ];
    const score = calculateSessionScore(challenges);
    expect(score).toBe(0);
  });

  it('returns ~50 for half passed with no time bonus', () => {
    const challenges = [
      { passed: true, timeSpentMs: 600000 },
      { passed: false, timeSpentMs: 600000 },
    ];
    const score = calculateSessionScore(challenges);
    expect(score).toBe(50);
  });

  it('never exceeds 100', () => {
    const challenges = Array(5).fill({ passed: true, timeSpentMs: 10000 });
    const score = calculateSessionScore(challenges);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('returns 0 for empty session', () => {
    expect(calculateSessionScore([])).toBe(0);
  });

  it('adds time bonus for sub-5-minute passes', () => {
    // Use 2 challenges so base is 50 and bonus is visible under the 100 cap
    const slow = calculateSessionScore([
      { passed: true, timeSpentMs: 600000 },
      { passed: false, timeSpentMs: 600000 },
    ]);
    const fast = calculateSessionScore([
      { passed: true, timeSpentMs: 60000 },
      { passed: false, timeSpentMs: 600000 },
    ]);
    expect(slow).toBe(50);
    expect(fast).toBe(52);
  });
});


describe('Simulator Challenge Selection', () => {
  it('returns the requested number of challenges', () => {
    const selected = selectSimulatorChallenges(
      { difficulty: 'mixed', category: 'mixed', count: 4 },
      []
    );
    expect(selected).toHaveLength(4);
  });

  it('excludes recently used challenge ids when pool is large enough', () => {
    const recentIds = ['be-01-list-files', 'be-02-read-write-file'];
    const selected = selectSimulatorChallenges(
      { difficulty: 'mixed', category: 'mixed', count: 5 },
      recentIds
    );
    const selectedIds = selected.map((c) => c.id);
    recentIds.forEach((id) => expect(selectedIds).not.toContain(id));
  });

  it('filters by difficulty when not mixed', () => {
    const selected = selectSimulatorChallenges(
      { difficulty: 'easy', category: 'mixed', count: 3 },
      []
    );
    selected.forEach((c) => expect(c.difficulty).toBe('easy'));
  });

  it('filters by category when not mixed', () => {
    const selected = selectSimulatorChallenges(
      { difficulty: 'mixed', category: 'be', count: 3 },
      []
    );
    selected.forEach((c) => expect(c.category).toBe('be'));
  });

  it('ensures at least one easy challenge for mixed difficulty', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const selected = selectSimulatorChallenges(
      { difficulty: 'mixed', category: 'mixed', count: 4 },
      []
    );
    expect(selected.some((c) => c.difficulty === 'easy')).toBe(true);
    vi.restoreAllMocks();
  });
});

describe('Simulator helpers', () => {
  it('formats duration as m:ss', () => {
    expect(formatDurationMs(125000)).toBe('2:05');
    expect(formatDurationMs(5000)).toBe('0:05');
  });

  it('returns score messages by band', () => {
    expect(getScoreMessage(90).colorClass).toBe('text-success');
    expect(getScoreMessage(70).colorClass).toBe('text-warning');
    expect(getScoreMessage(40).colorClass).toBe('text-error');
  });

  it('labels categories', () => {
    expect(getCategoryLabel('be')).toBe('Backend');
    expect(getCategoryLabel('react')).toBe('React');
    expect(getCategoryLabel('frontend')).toBe('Frontend');
    expect(getCategoryLabel('nextjs')).toBe('Next.js');
    expect(getCategoryLabel('mixed')).toBe('Mixed');
  });
});
