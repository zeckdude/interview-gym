1. `generateStaticParams()` should just `.map()` over `posts`, plucking out the `slug` field.
2. `getPost(slug)` is a straightforward `.find()` over the same `posts` array.
3. Returning `undefined` for a missing post is correct — don't throw and don't return a fake empty object.
