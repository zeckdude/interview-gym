export const starterTs = `interface Post {
  slug: string;
  title: string;
}

const posts: Post[] = [
  { slug: 'getting-started', title: 'Getting Started' },
  { slug: 'app-router-guide', title: 'The App Router Guide' },
  { slug: 'server-components', title: 'Understanding Server Components' },
];

function generateStaticParams(): { slug: string }[] {
  // Return one { slug } entry per post.

  return [];
}

function getPost(slug: string): Post | undefined {
  // Find and return the post with this slug.

  return undefined;
}

export { generateStaticParams, getPost, posts };`;

export const starterJs = `const posts = [
  { slug: 'getting-started', title: 'Getting Started' },
  { slug: 'app-router-guide', title: 'The App Router Guide' },
  { slug: 'server-components', title: 'Understanding Server Components' },
];

function generateStaticParams() {
  // Return one { slug } entry per post.

  return [];
}

function getPost(slug) {
  // Find and return the post with this slug.

  return undefined;
}

module.exports = { generateStaticParams, getPost, posts };`;

export const solutionTs = `interface Post {
  slug: string;
  title: string;
}

const posts: Post[] = [
  { slug: 'getting-started', title: 'Getting Started' },
  { slug: 'app-router-guide', title: 'The App Router Guide' },
  { slug: 'server-components', title: 'Understanding Server Components' },
];

function generateStaticParams(): { slug: string }[] {
  return posts.map((post) => ({ slug: post.slug }));
}

function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export { generateStaticParams, getPost, posts };`;

export const solutionJs = `const posts = [
  { slug: 'getting-started', title: 'Getting Started' },
  { slug: 'app-router-guide', title: 'The App Router Guide' },
  { slug: 'server-components', title: 'Understanding Server Components' },
];

function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

function getPost(slug) {
  return posts.find((post) => post.slug === slug);
}

module.exports = { generateStaticParams, getPost, posts };`;
