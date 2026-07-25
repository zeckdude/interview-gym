import type { UserPreferences } from '@prisma/client';
import {
  getDayOfWeekInTimezone,
  getHourInTimezone,
} from '@/lib/timezone';

export function shouldSendReminder(
  pref: Pick<UserPreferences, 'reminderTime' | 'reminderFrequency' | 'timezone'>,
  now: Date
): boolean {
  const userHour = getHourInTimezone(now, pref.timezone);
  const [reminderHour] = pref.reminderTime.split(':').map(Number);

  if (pref.reminderFrequency === 'daily') {
    return userHour === reminderHour;
  }

  if (pref.reminderFrequency === 'weekly') {
    const userDay = getDayOfWeekInTimezone(now, pref.timezone);
    return userDay === 1 && userHour === reminderHour;
  }

  return false;
}
