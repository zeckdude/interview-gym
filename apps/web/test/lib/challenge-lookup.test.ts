import { describe, expect, it } from 'vitest';
import {
  getChallengeDifficulty,
  getChallengeTitle,
  getChallengeHref,
  getCategoryLabel,
} from '@/lib/challenge-lookup';

describe('challenge-lookup', () => {
  it('getChallengeDifficulty returns known difficulty', () => {
    expect(getChallengeDifficulty('be-01-list-files', 'be')).toBeTruthy();
  });

  it('getChallengeDifficulty falls back to medium for unknown', () => {
    expect(getChallengeDifficulty('missing-id', 'be')).toBe('intermediate');
  });

  it('getChallengeTitle returns a title or the id', () => {
    const title = getChallengeTitle('be-01-list-files');
    expect(title.length).toBeGreaterThan(0);
    expect(getChallengeTitle('totally-unknown')).toBe('totally-unknown');
  });

  it('getChallengeHref builds paths by type', () => {
    expect(getChallengeHref('be-01-list-files', 'be')).toContain('/challenges/');
    expect(getChallengeHref('q-1', 'be-question')).toContain('/questions/');
  });

  it('getCategoryLabel covers categories', () => {
    expect(getCategoryLabel('be')).toBeTruthy();
    expect(getCategoryLabel('fe')).toBeTruthy();
    expect(getCategoryLabel('fe-advanced')).toBeTruthy();
  });
});
