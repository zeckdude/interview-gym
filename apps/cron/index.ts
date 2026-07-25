import cron from 'node-cron';

const APP_URL = process.env.APP_URL;
const CRON_SECRET = process.env.CRON_SECRET;

if (!APP_URL || !CRON_SECRET) {
  console.error('[cron] Missing required env vars: APP_URL and CRON_SECRET');
  process.exit(1);
}

cron.schedule('0 * * * *', async () => {
  console.log(`[${new Date().toISOString()}] Firing reminder check...`);
  try {
    const res = await fetch(`${APP_URL}/api/reminders`, {
      method: 'POST',
      headers: {
        'x-cron-secret': CRON_SECRET,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('[cron] Reminder check failed:', data);
      return;
    }
    console.log(`[cron] Sent ${data.sent} reminder emails`);
  } catch (err) {
    console.error('[cron] Reminder job failed:', err);
  }
});

console.log('Cron service started. Reminder check runs every hour at :00.');
