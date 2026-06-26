## The Challenge

You're given access to a simulated Node.js environment. Use the `fs` module to read all filenames in the current directory and return them as a single comma-separated string.

> **The simulated directory contains:** `index.js`, `package.json`, `README.md`, `server.js`

> **Expected output:** `"index.js, package.json, README.md, server.js"`

### What you need to know

- `fs.readdirSync('.')` returns an array of filenames in the current directory
- `Array.join(', ')` joins array items into a string with a separator

### Why this matters in interviews

This is a common warmup question that tests whether you know the Node.js `fs` module and can work with synchronous file system operations.
