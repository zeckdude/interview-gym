1. Start with an empty `reasons` array and push a human-readable string every time a rule matches — `needsClientDirective` is just `reasons.length > 0`.
2. A regex like `/\buse(State|Effect|Reducer|Ref|Context|LayoutEffect|ImperativeHandle)\b/` catches every client-only hook in one check.
3. Don't forget event handlers (`onClick=`, `onChange=`, ...) and browser globals (`window.`, `document.`, `localStorage.`) — both are common ways a component quietly becomes client-only.
