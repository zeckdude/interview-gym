## The Challenge

Read the contents of a simulated `input.txt` file, convert its text to uppercase, and write the result to `output.txt`. Return the string that was written.

> **input.txt contains:** `"hello from interview gym"`

> **Expected output.txt contents:** `"HELLO FROM INTERVIEW GYM"`

### What you need to know

- `fs.readFileSync(path, 'utf8')` reads a file and returns its contents as a string
- `fs.writeFileSync(path, data)` writes a string to a file
- JavaScript strings have a `.toUpperCase()` method

### Why this matters in interviews

Synchronous file I/O is a foundational Node.js skill. Interviewers use this to test whether you know the right encoding argument and can chain simple string operations.
