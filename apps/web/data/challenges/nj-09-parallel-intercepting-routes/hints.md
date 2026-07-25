1. `isParallelSlot` is a one-liner — check the first character of the folder name.
2. For `parseInterceptingRoute`, check the longer/more specific prefixes (`(..)(..)`  and `(...)`) before the shorter ones, or a greedy match on `(..)` could mis-parse `(..)(..)photo`.
3. Once you've matched and stripped the prefix, whatever text remains is the `segment` — make sure you're not leaving stray parentheses in it.
