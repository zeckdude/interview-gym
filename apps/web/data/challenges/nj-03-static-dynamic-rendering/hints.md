1. Check the explicit `dynamic` override first — `'force-static'` and `'force-dynamic'` should short-circuit before you look at anything else.
2. If there's no override, dynamic-ness comes down to one question: does anything about this request-time data get read? Cookies, headers, search params, and `fetchCache: 'no-store'` all count.
3. `revalidate: 0` means "dynamic" but `revalidate: 60` (or any other positive number) means "static with background regeneration" — don't treat all `revalidate` values the same.
