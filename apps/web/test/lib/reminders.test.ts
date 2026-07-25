import { describe, expect, it } from 'vitest';
import { shouldSendReminder } from '@/lib/reminders';

describe('shouldSendReminder', () => {
  it('returns true for daily at matching hour', () => {
    // 2024-06-10 15:00 UTC = 08:00 America/Los_Angeles (PDT)
    const now = new Date('2024-06-10T15:00:00Z');
    expect(
      shouldSendReminder(
        {
          reminderTime: '08:00',
          reminderFrequency: 'daily',
          timezone: 'America/Los_Angeles',
        },
        now
      )
    ).toBe(true);
  });

  it('returns false for daily at wrong hour', () => {
    const now = new Date('2024-06-10T15:00:00Z');
    expect(
      shouldSendReminder(
        {
          reminderTime: '09:00',
          reminderFrequency: 'daily',
          timezone: 'America/Los_Angeles',
        },
        now
      )
    ).toBe(false);
  });

  it('returns true for weekly only on Monday at matching hour', () => {
    // 2024-06-10 is a Monday
    const monday = new Date('2024-06-10T15:00:00Z');
    expect(
      shouldSendReminder(
        {
          reminderTime: '08:00',
          reminderFrequency: 'weekly',
          timezone: 'America/Los_Angeles',
        },
        monday
      )
    ).toBe(true);

    // 2024-06-11 is a Tuesday
    const tuesday = new Date('2024-06-11T15:00:00Z');
    expect(
      shouldSendReminder(
        {
          reminderTime: '08:00',
          reminderFrequency: 'weekly',
          timezone: 'America/Los_Angeles',
        },
        tuesday
      )
    ).toBe(false);
  });

  it('returns false for unknown frequency', () => {
    expect(
      shouldSendReminder(
        {
          reminderTime: '08:00',
          reminderFrequency: 'monthly' as 'daily',
          timezone: 'UTC',
        },
        new Date('2024-06-10T08:00:00Z')
      )
    ).toBe(false);
  });
});
