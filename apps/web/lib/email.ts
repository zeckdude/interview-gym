import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ReminderStats {
  streak: number;
  dueForReview: number;
  lastActivity: string;
}

function getFromAddress(): string {
  const email = process.env.RESEND_FROM_EMAIL!;
  const name = process.env.RESEND_FROM_NAME ?? 'Interview Gym';
  return `${name} <${email}>`;
}

function buildReminderSubject(stats: ReminderStats): string {
  return stats.streak > 0
    ? `🔥 Keep your ${stats.streak}-day streak alive — Interview Gym`
    : `💪 Time to get back in the gym — Interview Gym`;
}

function buildReminderHtml(stats: ReminderStats): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://interviewgym.dev';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interview Gym Reminder</title>
</head>
<body style="margin:0;padding:0;background-color:#FBF9F7;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FBF9F7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(26,23,20,0.10);">
          <tr>
            <td style="background-color:#1A1714;padding:24px 32px;">
              <p style="margin:0;font-size:24px;font-weight:700;color:#FFFFFF;">
                🏋️ Interview <span style="color:#FF6B35;">Gym</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${
                stats.streak > 0
                  ? `<h1 style="margin:0 0 8px;font-size:28px;font-weight:700;color:#1A1714;">Your ${stats.streak}-day streak is on the line 🔥</h1>
                   <p style="margin:0 0 24px;font-size:16px;color:#6B6560;">You've been building momentum. Don't let it stop today.</p>`
                  : `<h1 style="margin:0 0 8px;font-size:28px;font-weight:700;color:#1A1714;">Time to get back in the gym 💪</h1>
                   <p style="margin:0 0 24px;font-size:16px;color:#6B6560;">Every rep counts. Even 15 minutes today makes a difference.</p>`
              }
              ${
                stats.dueForReview > 0
                  ? `<div style="background-color:#FFF3ED;border-left:4px solid #FF6B35;border-radius:8px;padding:16px;margin-bottom:24px;">
                     <p style="margin:0;font-size:15px;color:#1A1714;"><strong>${stats.dueForReview} challenge${stats.dueForReview > 1 ? 's' : ''}</strong> due for review today.</p>
                   </div>`
                  : ''
              }
              <a href="${appUrl}" style="display:inline-block;background-color:#FF6B35;color:#FFFFFF;font-size:16px;font-weight:600;padding:14px 28px;border-radius:8px;text-decoration:none;">
                Open Interview Gym →
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #E8E2DA;">
              <p style="margin:0;font-size:13px;color:#A39E99;">
                You're receiving this because you enabled practice reminders.
                <a href="${appUrl}/settings" style="color:#FF6B35;">Update preferences</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function buildReminderText(stats: ReminderStats): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://interviewgym.dev';

  return stats.streak > 0
    ? `Your ${stats.streak}-day streak is on the line. Open Interview Gym: ${appUrl}`
    : `Time to get back in the gym. Open Interview Gym: ${appUrl}`;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export async function sendReminderEmail(
  to: string,
  stats: ReminderStats
): Promise<{ error?: string }> {
  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to,
    subject: buildReminderSubject(stats),
    html: buildReminderHtml(stats),
    text: buildReminderText(stats),
  });

  if (error) {
    return { error: error.message };
  }

  return {};
}
