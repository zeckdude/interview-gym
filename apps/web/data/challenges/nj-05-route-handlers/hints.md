1. Read `request.headers.authorization` and check it exists before doing anything else with it.
2. `"Bearer secret-token-123".slice(7)` strips the `"Bearer "` prefix so you can compare just the token part.
3. There are really only two outcomes — valid token returns 200 with data, everything else (missing header, wrong prefix, wrong token) returns the exact same 401 shape.
