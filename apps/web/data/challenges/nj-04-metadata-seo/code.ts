export const starterTs = `interface Post {
  title: string;
  excerpt: string;
  image: string;
}

interface Metadata {
  title: string;
  description: string;
  openGraph: { images: string[] };
}

const posts: Record<string, Post> = {
  'hello-world': { title: 'Hello World', excerpt: 'My first post', image: '/images/hello.png' },
  'nextjs-tips': { title: 'Next.js Tips', excerpt: '10 tips for Next.js', image: '/images/tips.png' },
};

function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  // Look up the post by params.slug and build the metadata object.
  // Fall back to a "not found" metadata object if the post doesn't exist.

  return { title: '', description: '', openGraph: { images: [] } };
}

export { generateMetadata, posts };`;

export const starterJs = `const posts = {
  'hello-world': { title: 'Hello World', excerpt: 'My first post', image: '/images/hello.png' },
  'nextjs-tips': { title: 'Next.js Tips', excerpt: '10 tips for Next.js', image: '/images/tips.png' },
};

function generateMetadata({ params }) {
  // Look up the post by params.slug and build the metadata object.
  // Fall back to a "not found" metadata object if the post doesn't exist.

  return { title: '', description: '', openGraph: { images: [] } };
}

module.exports = { generateMetadata, posts };`;

export const solutionTs = `interface Post {
  title: string;
  excerpt: string;
  image: string;
}

interface Metadata {
  title: string;
  description: string;
  openGraph: { images: string[] };
}

const posts: Record<string, Post> = {
  'hello-world': { title: 'Hello World', excerpt: 'My first post', image: '/images/hello.png' },
  'nextjs-tips': { title: 'Next.js Tips', excerpt: '10 tips for Next.js', image: '/images/tips.png' },
};

function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = posts[params.slug];

  if (!post) {
    return {
      title: 'Post Not Found | My Blog',
      description: 'This post could not be found.',
      openGraph: { images: [] },
    };
  }

  return {
    title: post.title + ' | My Blog',
    description: post.excerpt,
    openGraph: { images: [post.image] },
  };
}

export { generateMetadata, posts };`;

export const solutionJs = `const posts = {
  'hello-world': { title: 'Hello World', excerpt: 'My first post', image: '/images/hello.png' },
  'nextjs-tips': { title: 'Next.js Tips', excerpt: '10 tips for Next.js', image: '/images/tips.png' },
};

function generateMetadata({ params }) {
  const post = posts[params.slug];

  if (!post) {
    return {
      title: 'Post Not Found | My Blog',
      description: 'This post could not be found.',
      openGraph: { images: [] },
    };
  }

  return {
    title: post.title + ' | My Blog',
    description: post.excerpt,
    openGraph: { images: [post.image] },
  };
}

module.exports = { generateMetadata, posts };`;
