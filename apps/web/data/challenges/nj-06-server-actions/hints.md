1. Build an `errors` object first, adding a key only when that specific field fails validation.
2. `success` is simply "did the errors object end up empty" — `Object.keys(errors).length === 0`.
3. Check both "is it missing" and "is it too short" for each field — an empty string still needs a validation message.
