# Form Validation

## What You're Building

Implement a `validateForm` function that validates form field values against a set of rules and returns structured error messages.

## Requirements

- `validateForm(values, rules)` returns `{ valid: boolean, errors: Record<string, string[]> }`
- Rules per field: `required`, `minLength`, `maxLength`, `pattern` (regex), `custom` (function)
- `errors` maps field names to arrays of error strings
- Empty error arrays mean the field is valid
- `valid` is `true` only if ALL fields pass ALL their rules

## Example

```js
validateForm(
  { email: '', password: 'abc' },
  {
    email: { required: true },
    password: { minLength: 8 },
  }
)
// → {
//   valid: false,
//   errors: {
//     email: ['email is required'],
//     password: ['password must be at least 8 characters'],
//   }
// }
```

## Why This Comes Up in Interviews

Form validation is unavoidable in frontend work. A clean validation API shows you can design for extensibility and handle multiple error conditions per field — skills every product engineer needs.

## What You Need to Know

- Iterating over fields and their rules
- Building structured error objects
- Regex testing: `pattern.test(value)`
- Custom validator functions: `(value) => string | null`
