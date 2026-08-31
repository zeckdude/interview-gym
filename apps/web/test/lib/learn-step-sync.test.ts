import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  isLearnStepMilestone,
  queueStepStateSync,
} from '@/lib/learn/step-sync';

describe('learn step sync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('detects milestone patches', () => {
    expect(isLearnStepMilestone({ predictPassed: true })).toBe(true);
    expect(isLearnStepMilestone({ codePassed: true })).toBe(true);
    expect(isLearnStepMilestone({ choicePassed: true })).toBe(true);
    expect(isLearnStepMilestone({ answerRevealed: true })).toBe(true);
    expect(isLearnStepMilestone({ revealed: true })).toBe(true);
    expect(isLearnStepMilestone({ code: 'const x = 1;' })).toBe(false);
    expect(isLearnStepMilestone({ hintLevel: 2 })).toBe(false);
  });

  it('debounces non-milestone syncs', async () => {
    queueStepStateSync('js-01-introduction', 'intro-1', { code: 'draft' });

    expect(fetch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(599);
    expect(fetch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    await Promise.resolve();

    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith('/api/learn/step-state', expect.objectContaining({
      method: 'PUT',
    }));
  });

  it('syncs milestones immediately', async () => {
    queueStepStateSync(
      'js-01-introduction',
      'intro-1',
      { predictPassed: true },
      true
    );

    await Promise.resolve();
    expect(fetch).toHaveBeenCalledOnce();
  });
});
