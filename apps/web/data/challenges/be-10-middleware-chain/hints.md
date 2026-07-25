1. If you have an array of middleware functions, how would you call the first one, then the second, then the third — one after another when next() is called?
2. How could you use recursion or an index counter to implement the "call next middleware" behavior?
3. What needs to happen if the last middleware in the chain calls next()? Should that cause an error?
