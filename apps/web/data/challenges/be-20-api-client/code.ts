export const starterTs = `interface ApiClientOptions {
  baseUrl: string;
  headers?: Record<string, string>;
}

interface ApiClient {
  get<T = unknown>(path: string, headers?: Record<string, string>): Promise<T>;
  post<T = unknown>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T>;
  put<T = unknown>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T>;
  delete<T = unknown>(path: string, headers?: Record<string, string>): Promise<T>;
}

function createApiClient(options: ApiClientOptions): ApiClient {
  // Implement API client wrapper here

  return {
    get() { return Promise.resolve(null as T); },
    post() { return Promise.resolve(null as T); },
    put() { return Promise.resolve(null as T); },
    delete() { return Promise.resolve(null as T); },
  } as ApiClient;
}

export { createApiClient };`;

export const starterJs = `function createApiClient(options) {
  const { baseUrl, headers: defaultHeaders = {} } = options;

  // Implement API client wrapper here

  return {
    get(path) { return Promise.resolve(null); },
    post(path, body) { return Promise.resolve(null); },
    put(path, body) { return Promise.resolve(null); },
    delete(path) { return Promise.resolve(null); },
  };
}

module.exports = { createApiClient };`;

export const solutionTs = `interface ApiClientOptions {
  baseUrl: string;
  headers?: Record<string, string>;
}

interface ApiClient {
  get<T = unknown>(path: string, headers?: Record<string, string>): Promise<T>;
  post<T = unknown>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T>;
  put<T = unknown>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T>;
  delete<T = unknown>(path: string, headers?: Record<string, string>): Promise<T>;
}

function createApiClient(options: ApiClientOptions): ApiClient {
  const { baseUrl, headers: defaultHeaders = {} } = options;

  async function request<T>(method: string, path: string, body?: unknown, extraHeaders?: Record<string, string>): Promise<T> {
    const url = baseUrl.replace(/\\/$/, '') + path;
    const headers: Record<string, string> = { ...defaultHeaders, ...(extraHeaders ?? {}) };
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    const res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
    return res.json() as Promise<T>;
  }

  return {
    get: (path, headers) => request('GET', path, undefined, headers),
    post: (path, body, headers) => request('POST', path, body, headers),
    put: (path, body, headers) => request('PUT', path, body, headers),
    delete: (path, headers) => request('DELETE', path, undefined, headers),
  };
}

export { createApiClient };`;

export const solutionJs = `function createApiClient(options) {
  const { baseUrl, headers: defaultHeaders = {} } = options;

  async function request(method, path, body, extraHeaders) {
    const url = baseUrl.replace(/\\/$/, '') + path;
    const headers = { ...defaultHeaders, ...(extraHeaders ?? {}) };
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    const res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
    return res.json();
  }

  return {
    get: (path, headers) => request('GET', path, undefined, headers),
    post: (path, body, headers) => request('POST', path, body, headers),
    put: (path, body, headers) => request('PUT', path, body, headers),
    delete: (path, headers) => request('DELETE', path, undefined, headers),
  };
}

module.exports = { createApiClient };`;
