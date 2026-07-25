# Validation Schema

## What You're Building

Implement a `createSchema` function that validates objects against a schema definition — like a tiny version of Zod or Yup.

## Requirements

- `createSchema(definition)` returns a `validate(data)` function
- `definition` is an object where each key maps to a validator spec
- Validator spec: `{ type: 'string' | 'number' | 'boolean', required?: boolean }`
- `validate(data)` returns `{ valid: boolean, errors: string[] }`
- Error messages should be descriptive: `"name is required"`, `"age must be a number"`

## Example

```js
const schema = createSchema({
  name: { type: 'string', required: true },
  age: { type: 'number', required: true },
  active: { type: 'boolean' },
});

schema.validate({ name: 'Alice', age: 30 });
// → { valid: true, errors: [] }

schema.validate({ name: 'Bob', age: 'old' });
// → { valid: false, errors: ['age must be a number'] }

schema.validate({});
// → { valid: false, errors: ['name is required', 'age is required'] }
```

## Why This Comes Up in Interviews

Schema validation is foundational to API design and data integrity. Building one from scratch demonstrates that you understand how to design fluent, composable validation APIs.

## What You Need to Know

- `typeof` for type checking
- Object.entries for iterating schema fields
- Collecting validation errors into an array
- Required vs optional field handling
