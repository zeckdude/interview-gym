1. fs.promises.readFile returns a Promise — async/await works great here.
2. Wrap your read in try/catch to handle missing files.
3. Return "file not found" as a string, not an Error object.
