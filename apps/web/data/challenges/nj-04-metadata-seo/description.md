# Dynamic Metadata for SEO

## What You're Building

The App Router generates `<title>` and `<meta>` tags from a special `generateMetadata()` export instead of a hardcoded `<head>`. Implement `generateMetadata()` for a blog post page — it must look up the post and build metadata dynamically, with a safe fallback when the post doesn't exist.

## Requirements

- `generateMetadata({ params })` receives `params.slug` and returns a metadata object
- When the post **exists**: `{ title: "<post title> | My Blog", description: "<post excerpt>", openGraph: { images: [<post image>] } }`
- When the post **does not exist**: `{ title: "Post Not Found | My Blog", description: "This post could not be found.", openGraph: { images: [] } }`
- A `posts` lookup table is provided in the starter code — use it, don't hardcode the two example posts

> **Expected Output**
>
> `generateMetadata({ params: { slug: 'hello-world' } })` → `{ title: 'Hello World | My Blog', description: 'My first post', openGraph: { images: ['/images/hello.png'] } }`

## Example

```ts
generateMetadata({ params: { slug: 'hello-world' } });
// → { title: 'Hello World | My Blog', description: 'My first post', openGraph: { images: ['/images/hello.png'] } }

generateMetadata({ params: { slug: 'does-not-exist' } });
// → { title: 'Post Not Found | My Blog', description: 'This post could not be found.', openGraph: { images: [] } }
```

## Why This Comes Up in Interviews

SEO is a real business requirement, and `generateMetadata` is the App Router's answer to it. Interviewers check whether you know it can be **async and dynamic** (unlike the old static `<Head>` component) — and whether you remember to handle the "not found" case so search engines don't index a broken title.

## What You Need to Know

- `generateMetadata()` can be `async` and receives the same `params` as the page component
- It replaces the old `next/head` approach entirely in the App Router
- Always handle the missing-data case — an untitled or broken metadata object hurts SEO and social previews
- `openGraph` fields control how the link looks when shared on social media
