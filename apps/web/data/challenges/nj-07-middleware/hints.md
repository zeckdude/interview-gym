1. Use `pathname === path || pathname.startsWith(path + '/')` to correctly match both the exact protected path and nested ones.
2. There are three outcomes to handle, in order: protected-without-session, login-with-session, and everything else.
3. Don't forget the default case — most requests should just get `{ type: 'next' }`.
