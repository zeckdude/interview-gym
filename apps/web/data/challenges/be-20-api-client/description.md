# API Client Wrapper

## What You're Building

Implement a `createApiClient` function that wraps the `fetch` API with base URL, default headers, and automatic JSON parsing — the kind of utility every frontend and full-stack team writes.

## Requirements

- `createApiClient({ baseUrl, headers? })` returns a client with `get`, `post`, `put`, `delete` methods
- Each method takes a path and optional body/options, prepends `baseUrl`
- Automatically sets `Content-Type: application/json` for POST/PUT
- Automatically merges default headers with per-request headers
- Returns the parsed JSON response
- Throws an error if the response is not OK (status >= 400)

## Example

```js
const api = createApiClient({
  baseUrl: 'https://api.example.com',
  headers: { Authorization: 'Bearer token123' },
});

const user = await api.get('/users/1');
// → fetches https://api.example.com/users/1 with Auth header

await api.post('/users', { name: 'Alice' });
// → POST with JSON body and Content-Type: application/json
```

## Why This Comes Up in Interviews

Every team writes an API client wrapper. Interviewers use this to see if you understand how `fetch` works, how to compose headers cleanly, and how to design a reusable HTTP client interface.

## What You Need to Know

- `fetch` API: URL, options, headers
- `response.ok` for status checking
- `response.json()` for parsing
- Header merging with spread operators
- Method-specific behavior (GET has no body, POST/PUT do)
