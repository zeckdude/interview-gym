## The Challenge

Implement a `debounce(fn, delay)` function from scratch. It should delay invoking `fn` until after `delay` milliseconds have elapsed since the last time it was called. The returned function should also have a `.cancel()` method that cancels any pending invocation.

> **Example usage:**
> ```js
> const debouncedSave = debounce(save, 300);
> debouncedSave(); // not called yet
> debouncedSave(); // not called yet, timer resets
> // 300ms later → save() is called once
> ```

### What you need to know

- Use `setTimeout` and `clearTimeout` inside a closure
- Each new call should cancel the previous timer and start a fresh one
- `.cancel()` should call `clearTimeout` on the stored timer ID

### Why this matters in interviews

Debounce is one of the most common utility functions asked in frontend and backend interviews. It tests closures, timer APIs, and higher-order functions all at once.
