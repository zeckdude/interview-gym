export const starterTs = `async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<Response> {
  // Implement fetch with retry logic here
  return fetch(url, options);
}

export { fetchWithRetry };`;

export const starterJs = `async function fetchWithRetry(url, options = {}, retries = 3) {
  // Implement fetch with retry logic here
  return fetch(url, options);
}

module.exports = { fetchWithRetry };`;

export const solutionTs = `async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.status >= 400 && res.status < 500) return res; // 4xx: don't retry
      if (res.ok) return res;
      lastError = new Error(\`HTTP \${res.status}\`);
    } catch (err) {
      lastError = err;
    }

    if (attempt < retries) {
      await new Promise((r) => setTimeout(r, 100 * (attempt + 1)));
    }
  }

  throw lastError;
}

export { fetchWithRetry };`;

export const solutionJs = `async function fetchWithRetry(url, options = {}, retries = 3) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.status >= 400 && res.status < 500) return res;
      if (res.ok) return res;
      lastError = new Error(\`HTTP \${res.status}\`);
    } catch (err) {
      lastError = err;
    }

    if (attempt < retries) {
      await new Promise((r) => setTimeout(r, 100 * (attempt + 1)));
    }
  }

  throw lastError;
}

module.exports = { fetchWithRetry };`;
