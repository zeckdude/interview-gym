import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const fn = getExport<(path: string, session: { userId: string; role: string } | null) => string | null>(exports, 'resolveAuthRedirect');
const t1 = fn('/dashboard/settings', null) === '/login?redirect=%2Fdashboard%2Fsettings';
const t2 = fn('/admin/users', { userId: '1', role: 'user' }) === '/dashboard';
const t3 = fn('/admin/users', { userId: '1', role: 'admin' }) === null;
const t4 = fn('/login', { userId: '1', role: 'user' }) === '/dashboard';
const t5 = fn('/api/public/health', null) === null;
return { passed: t1&&t2&&t3&&t4&&t5, results: [
  { description: 'Unauthenticated dashboard → login redirect', expected: '/login?redirect=%2Fdashboard%2Fsettings', actual: String(fn('/dashboard/settings', null)), passed: t1 },
  { description: 'Non-admin on /admin → /dashboard', expected: '/dashboard', actual: String(fn('/admin/users', { userId:'1', role:'user' })), passed: t2 },
  { description: 'Admin on /admin → proceed', expected: 'null', actual: String(fn('/admin/users', { userId:'1', role:'admin' })), passed: t3 },
  { description: 'Logged-in /login → /dashboard', expected: '/dashboard', actual: String(fn('/login', { userId:'1', role:'user' })), passed: t4 },
  { description: 'Public API route → proceed', expected: 'null', actual: String(fn('/api/public/health', null)), passed: t5 },
]};
  } catch (e: unknown) {
    return errorResult(e);
  }
}
