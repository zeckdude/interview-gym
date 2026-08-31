import { PageWrapper } from '@/components/layout/PageWrapper';
import { ReminderSettings } from '@/components/settings/ReminderSettings';
import { AudioSettings } from '@/components/settings/AudioSettings';
import { LearningPreferencesSettings } from '@/components/settings/LearningPreferencesSettings';

export default function SettingsPage() {
  return (
    <PageWrapper title="Settings">
      <div className="space-y-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary mb-2">
            Settings ⚙️
          </h1>
          <p className="font-body text-text-primary text-base">
            Control how Interview Gym keeps you accountable and how much scaffolding you get while learning.
          </p>
        </div>
        <LearningPreferencesSettings />
        <ReminderSettings />
        <AudioSettings />
      </div>
    </PageWrapper>
  );
}
