1. Set the status to `'loading'` synchronously, before you `await` or `.then()` the function's result.
2. Wrap the call in a `try/catch` (or use `.then`/`.catch`) so a rejection updates `getError()` instead of throwing out of `run()`.
3. `reset()` just needs to set status back to `'idle'` and clear out both the stored data and error — it doesn't need to re-run anything itself.
