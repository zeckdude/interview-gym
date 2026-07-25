export const starterTs = `interface User { id: string; name: string; }
interface Stats { visits: number; }

let log: string[] = [];
function resetLog(): void { log = []; }
function getLog(): string[] { return log; }

function getUser(userId: string): Promise<User> {
  log.push('user:start');
  return new Promise((resolve) => {
    setTimeout(() => {
      log.push('user:end');
      resolve({ id: userId, name: 'Ada Lovelace' });
    }, 20);
  });
}

function getStats(): Promise<Stats> {
  log.push('stats:start');
  return new Promise((resolve) => {
    setTimeout(() => {
      log.push('stats:end');
      resolve({ visits: 1024 });
    }, 20);
  });
}

async function loadDashboardData(userId: string): Promise<{ user: User; stats: Stats }> {
  // Fix the waterfall: start both requests before awaiting either one.
  const user = await getUser(userId);
  const stats = await getStats();
  return { user, stats };
}

export { getUser, getStats, loadDashboardData, resetLog, getLog };`;

export const starterJs = `let log = [];
function resetLog() { log = []; }
function getLog() { return log; }

function getUser(userId) {
  log.push('user:start');
  return new Promise((resolve) => {
    setTimeout(() => {
      log.push('user:end');
      resolve({ id: userId, name: 'Ada Lovelace' });
    }, 20);
  });
}

function getStats() {
  log.push('stats:start');
  return new Promise((resolve) => {
    setTimeout(() => {
      log.push('stats:end');
      resolve({ visits: 1024 });
    }, 20);
  });
}

async function loadDashboardData(userId) {
  // Fix the waterfall: start both requests before awaiting either one.
  const user = await getUser(userId);
  const stats = await getStats();
  return { user, stats };
}

module.exports = { getUser, getStats, loadDashboardData, resetLog, getLog };`;

export const solutionTs = `interface User { id: string; name: string; }
interface Stats { visits: number; }

let log: string[] = [];
function resetLog(): void { log = []; }
function getLog(): string[] { return log; }

function getUser(userId: string): Promise<User> {
  log.push('user:start');
  return new Promise((resolve) => {
    setTimeout(() => {
      log.push('user:end');
      resolve({ id: userId, name: 'Ada Lovelace' });
    }, 20);
  });
}

function getStats(): Promise<Stats> {
  log.push('stats:start');
  return new Promise((resolve) => {
    setTimeout(() => {
      log.push('stats:end');
      resolve({ visits: 1024 });
    }, 20);
  });
}

async function loadDashboardData(userId: string): Promise<{ user: User; stats: Stats }> {
  const [user, stats] = await Promise.all([getUser(userId), getStats()]);
  return { user, stats };
}

export { getUser, getStats, loadDashboardData, resetLog, getLog };`;

export const solutionJs = `let log = [];
function resetLog() { log = []; }
function getLog() { return log; }

function getUser(userId) {
  log.push('user:start');
  return new Promise((resolve) => {
    setTimeout(() => {
      log.push('user:end');
      resolve({ id: userId, name: 'Ada Lovelace' });
    }, 20);
  });
}

function getStats() {
  log.push('stats:start');
  return new Promise((resolve) => {
    setTimeout(() => {
      log.push('stats:end');
      resolve({ visits: 1024 });
    }, 20);
  });
}

async function loadDashboardData(userId) {
  const [user, stats] = await Promise.all([getUser(userId), getStats()]);
  return { user, stats };
}

module.exports = { getUser, getStats, loadDashboardData, resetLog, getLog };`;
