## The Challenge

Implement `resolveAuthRedirect(path, session)` for middleware-style auth:

- Public routes (`/login`, `/signup`, `/api/public/*`) never redirect
- `/admin/*` requires role `admin`; otherwise redirect to `/dashboard`
- Other `/dashboard/*` routes require any authenticated session; otherwise redirect to `/login?redirect=<path>`
- Authenticated users visiting `/login` redirect to `/dashboard`
- Return `null` when request should proceed