import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface ImageProps {
  src: string;
  width: number;
  height: number;
  alt: string;
  sizes?: string;
  priority?: boolean;
  loading?: 'lazy';
}

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const fn = getExport<
      (input: { src: string; width: number; height: number; aboveFold: boolean }) => ImageProps
    >(exports, 'buildImageProps');

    const hero = fn({ src: '/hero.jpg', width: 1200, height: 600, aboveFold: true });
    const below = fn({ src: '/thumb.jpg', width: 400, height: 400, aboveFold: false });
    const t1 = hero.priority === true && hero.loading === undefined;
    const t2 = below.loading === 'lazy' && below.priority === undefined;
    const t3 = Boolean(hero.sizes?.includes('100vw'));

    return {
      passed: t1 && t2 && t3,
      results: [
        {
          description: 'Above-fold image gets priority',
          expected: 'priority true',
          actual: JSON.stringify(hero),
          passed: t1,
        },
        {
          description: 'Below-fold image lazy loads',
          expected: 'loading lazy',
          actual: JSON.stringify(below),
          passed: t2,
        },
        {
          description: 'Includes responsive sizes',
          expected: '100vw in sizes',
          actual: String(hero.sizes),
          passed: t3,
        },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
