1. Use `params.slug` to look up the post in the provided `posts` table before building anything else.
2. If the lookup returns nothing, return the fallback metadata object immediately instead of trying to read fields off `undefined`.
3. Keep the exact fallback strings — `"Post Not Found | My Blog"` and `"This post could not be found."` — the tests check for them precisely.
