# Path Join Utility

## What You're Building

Implement a `pathJoin` function that joins path segments using `/` as the separator — just like Node's `path.join()`, but implemented from scratch.

## Requirements

- Join any number of string segments with `/`
- Normalize multiple consecutive slashes into a single `/`
- Remove trailing slashes (except for root `/`)
- Handle leading slashes correctly — the result should be a clean, normalized path
- Empty segments should be ignored

## Example

```js
pathJoin('users', 'admin', 'profile') // → 'users/admin/profile'
pathJoin('/api/', '/v1/', '/users')    // → '/api/v1/users'
pathJoin('a', '', 'b', 'c')           // → 'a/b/c'
pathJoin('/root/', 'dir', '')          // → '/root/dir'
```

## Why This Comes Up in Interviews

Path manipulation is a common utility task that tests your ability to handle edge cases cleanly. Interviewers use it to see if you can write defensive, well-reasoned string processing code without reaching for a library.

## What You Need to Know

- `String.prototype.split()` and `Array.prototype.join()`
- Filtering empty strings from arrays
- Regex for normalizing slashes: `/\/+/g`
- Edge case reasoning: what is the "right" answer for edge inputs?
