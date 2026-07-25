import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNjPerformance: Lesson = {
  id: 'lesson-nj-performance',
  title: 'Performance Optimization in Next.js',
  category: 'nextjs',
  difficulty: 'intermediate',
  relatedChallengeIds: ['nj-16-image-optimization', 'nj-18-performance-bundle'],
  estimatedMinutes: 15,
  concepts: ['next/image', 'code splitting', 'bundle analysis', 'core web vitals'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
Two levers move the needle most on a Next.js page's performance score:

**1. Images.** \`next/image\` lazy-loads anything off-screen by default and reserves layout space using \`width\`/\`height\` to prevent Cumulative Layout Shift (CLS). The single most important prop is \`priority\` — set it **only** on the image that's your Largest Contentful Paint (LCP) candidate (usually a hero image above the fold) so it skips lazy loading and preloads instead. Setting \`priority\` everywhere defeats the purpose of lazy loading and can actually hurt LCP by competing for bandwidth.

**2. JavaScript bundle size.** Every \`'use client'\` component ships its code to the browser. Use \`@next/bundle-analyzer\` to see what's actually being shipped, and \`next/dynamic\` to code-split large, non-critical Client Components (a rich text editor, a charting library) so they don't block the initial page load.

**The Core Web Vitals cheat sheet:**
- **LCP** (loading) — biggest visible element loads late → check \`priority\`, TTFB, render-blocking resources
- **CLS** (stability) — layout jumps → check image/embed dimensions, font loading
- **INP** (interactivity) — slow response to clicks/taps → check client bundle size, expensive re-renders
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'typescript',
      content: `import Image from 'next/image';
import dynamic from 'next/dynamic';

// Above-the-fold hero image — mark as priority, skip lazy loading
<Image src={hero} alt="Hero" width={1200} height={600} priority />

// Below-the-fold image — lazy loaded automatically, no priority needed
<Image src={thumbnail} alt="Thumbnail" width={300} height={200} />

// Defer a heavy Client Component until it's actually needed
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  loading: () => <Skeleton />,
});`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**"Marking every image as \`priority\` will make the page load faster."** It does the opposite — \`priority\` tells the browser to preload that image with high priority, competing with other critical resources. If everything is "high priority," nothing actually is. Reserve it for the single LCP candidate.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-nj-performance',
    prompt: `Implement findMisconfiguredImages(images) — given a list of { isAboveFold, priority } image descriptors, return the indices of images that are misconfigured: above the fold but missing priority, OR below the fold but marked priority.`,
    timeLimitSeconds: 150,
    starterCode: {
      javascript: `function findMisconfiguredImages(images) {
  
}`,
      typescript: `interface ImageDescriptor {
  isAboveFold: boolean;
  priority: boolean;
}

function findMisconfiguredImages(images: ImageDescriptor[]): number[] {
  
}`,
    },
    solution: {
      javascript: `function findMisconfiguredImages(images) {
  const result = [];
  images.forEach((img, i) => {
    if ((img.isAboveFold && !img.priority) || (!img.isAboveFold && img.priority)) {
      result.push(i);
    }
  });
  return result;
}`,
      typescript: `interface ImageDescriptor {
  isAboveFold: boolean;
  priority: boolean;
}

function findMisconfiguredImages(images: ImageDescriptor[]): number[] {
  const result: number[] = [];
  images.forEach((img, i) => {
    if ((img.isAboveFold && !img.priority) || (!img.isAboveFold && img.priority)) {
      result.push(i);
    }
  });
  return result;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'findMisconfiguredImages');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function(
          'findMisconfiguredImages',
          `const images = [
            { isAboveFold: true, priority: true },
            { isAboveFold: true, priority: false },
            { isAboveFold: false, priority: true },
            { isAboveFold: false, priority: false },
          ];
          return Boolean(JSON.stringify(findMisconfiguredImages(images)) === JSON.stringify([1, 2]));`
        );
        const ok = testRunner(result.value);
        return ok
          ? { passed: true, feedback: 'Perfect! All tests passed. ✓' }
          : { passed: false, feedback: 'Not quite — check the requirements and try again.' };
      } catch (e) {
        return { passed: false, feedback: `Error running tests: ${e instanceof Error ? e.message : String(e)}` };
      }
    },
  },
  mdnLinks: [
    { label: 'Image Optimization — Next.js Docs', url: 'https://nextjs.org/docs/app/building-your-application/optimizing/images' },
    { label: 'Lazy Loading — Next.js Docs', url: 'https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading' },
  ],
};
