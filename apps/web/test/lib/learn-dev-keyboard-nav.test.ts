import { describe, expect, it } from 'vitest';
import {
  getLearnDevJumpDirection,
  isEditableKeyboardTarget,
  resolveLearnDevJumpTargetIndex,
} from '@/lib/learn/dev-keyboard-nav';

describe('learn dev keyboard nav', () => {
  it('detects Cmd+Shift+Arrow jump chords', () => {
    expect(
      getLearnDevJumpDirection({
        key: 'ArrowLeft',
        metaKey: true,
        ctrlKey: false,
        shiftKey: true,
        altKey: false,
      })
    ).toBe('prev');
    expect(
      getLearnDevJumpDirection({
        key: 'ArrowRight',
        metaKey: false,
        ctrlKey: true,
        shiftKey: true,
        altKey: false,
      })
    ).toBe('next');
  });

  it('rejects bare arrows and Alt+Arrow', () => {
    expect(
      getLearnDevJumpDirection({
        key: 'ArrowLeft',
        metaKey: false,
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
      })
    ).toBeNull();
    expect(
      getLearnDevJumpDirection({
        key: 'ArrowLeft',
        metaKey: false,
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
      })
    ).toBeNull();
  });

  it('resolves jump targets within bounds', () => {
    expect(resolveLearnDevJumpTargetIndex('prev', 2, 5)).toBe(1);
    expect(resolveLearnDevJumpTargetIndex('next', 2, 5)).toBe(3);
    expect(resolveLearnDevJumpTargetIndex('prev', 0, 5)).toBeNull();
    expect(resolveLearnDevJumpTargetIndex('next', 4, 5)).toBeNull();
  });

  it('treats Monaco and form fields as editable targets', () => {
    const input = document.createElement('input');
    expect(isEditableKeyboardTarget(input)).toBe(true);

    const wrapper = document.createElement('div');
    wrapper.className = 'monaco-editor';
    const inner = document.createElement('div');
    wrapper.appendChild(inner);
    expect(isEditableKeyboardTarget(inner)).toBe(true);
  });
});
