## The Challenge

Write a `getConfig()` function that reads from a provided env object (simulating `process.env`) and returns a typed config object. If any required variable is missing, throw a descriptive error message naming the missing variable.

> **Required variables:** `DATABASE_URL`, `API_KEY`, `PORT`

> **Example:**
> ```js
> getConfig({ DATABASE_URL: 'postgres://...', API_KEY: 'abc', PORT: '3000' })
> // → { databaseUrl: 'postgres://...', apiKey: 'abc', port: 3000 }
>
> getConfig({ DATABASE_URL: 'postgres://...' })
> // → throws Error('Missing required env variable: API_KEY')
> ```

### What you need to know

- Iterate over the required keys and throw on the first one that's missing
- `PORT` comes in as a string — convert it to a number with `Number()` or `parseInt()`
- Return camelCase keys in the config object

### Why this matters in interviews

Every real backend app has a config module. This tests validation patterns, error messaging, and type coercion — three things that show up constantly in production code.
