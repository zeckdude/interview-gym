# Server Actions for Form Handling

## What You're Building

Server Actions let a `<form>` call server-side code directly — no API route, no client-side fetch. Implement `createPost()`, the action behind a "new blog post" form, complete with field validation.

## Requirements

- `createPost(formData)` receives `{ title: string, content: string }`
- `title` is required and must be **at least 3 characters**
- `content` is required and must be **at least 10 characters**
- Return `{ success: boolean, errors: Record<string, string> }`
- `errors` should only contain keys for fields that actually failed — a valid submission returns `{ success: true, errors: {} }`

> **Expected Output**
>
> `createPost({ title: '', content: '' })` → `{ success: false, errors: { title: '...', content: '...' } }`

## Example

```ts
createPost({ title: 'Hi', content: 'Too short' });
// → { success: false, errors: { title: '...', content: '...' } }

createPost({ title: 'Hello World', content: 'This is a long enough post body.' });
// → { success: true, errors: {} }
```

## Why This Comes Up in Interviews

Server Actions blur the line between client and server code, and validation is the part people forget — never trust that the client already validated the form. Interviewers check that you re-validate on the server, since Server Actions are just as callable as any API endpoint.

## What You Need to Know

- A Server Action is an async function marked with `'use server'`, passed directly to a `<form action={...}>`
- It runs on the server even when triggered from a Client Component
- Always validate again on the server — client-side validation is just UX, not security
- Return structured error state instead of throwing, so the form can show inline field errors
