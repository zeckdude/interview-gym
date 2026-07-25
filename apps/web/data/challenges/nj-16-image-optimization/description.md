## The Challenge

Implement `buildImageProps({ src, width, height, aboveFold })` returning props for `next/image`:

- Always include `src`, `width`, `height`, `alt: ''`
- `aboveFold: true` → `priority: true`, no `loading`
- `aboveFold: false` → `loading: 'lazy'`, no `priority`
- Include responsive `sizes: '(max-width: 768px) 100vw, 50vw'`