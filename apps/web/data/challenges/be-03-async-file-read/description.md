## The Challenge

Read a file asynchronously using `fs.promises.readFile`. Return a Promise that resolves to the file's contents as a UTF-8 string. Handle the case where the file does not exist by returning the string `"file not found"` instead of throwing.

> **Returns:** a `Promise<string>` — either the file contents or `"file not found"`

### What you need to know

- `fs.promises.readFile(path, 'utf8')` returns a Promise that resolves to the file contents
- `async/await` makes Promise-based code easy to read
- Wrap your read in `try/catch` to gracefully handle missing files

### Why this matters in interviews

Async file I/O is everywhere in Node.js backends. This tests whether you're comfortable with Promises, async/await, and basic error handling — three things every Node.js developer must know.
