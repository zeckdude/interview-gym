1. Split both the route's file path and the pathname into segments, then compare them segment by segment.
2. Strip the leading `app/` and trailing `/page.tsx`, and filter out any segment wrapped in parentheses like `(marketing)` before comparing — route groups don't count toward the URL.
3. A catch-all segment `[...name]` should only be allowed as the last segment, and it should swallow all remaining pathname segments (joined with `/`) instead of just one.
