import { getImage, type ImageMetadata } from 'astro:assets';

const localImages = import.meta.glob<{ default: ImageMetadata }>('/src/assets/blog/*', {
  eager: true,
});

export interface ResolvedArticleImage {
  src: string;
  isRemote: boolean;
  alt: string;
  width: number;
  height: number;
}

export async function resolveArticleImage(
  imagePath: string,
  alt: string,
  width: number,
  height: number,
): Promise<ResolvedArticleImage | null> {
  if (imagePath.startsWith('http')) {
    return { src: imagePath, isRemote: true, alt, width, height };
  }

  const key = `/src/assets/${imagePath}`;
  const mod = localImages[key];

  if (!mod) {
    return null;
  }

  if (imagePath.endsWith('.svg')) {
    return {
      src: mod.default.src,
      isRemote: false,
      alt,
      width,
      height,
    };
  }

  const optimized = await getImage({
    src: mod.default,
    width,
    height,
  });

  return {
    src: optimized.src,
    isRemote: false,
    alt,
    width: optimized.attributes.width ?? width,
    height: optimized.attributes.height ?? height,
  };
}

export async function resolveArticleImageWithFallback(
  imagePath: string,
  alt: string,
  width: number,
  height: number,
): Promise<ResolvedArticleImage> {
  const resolved = await resolveArticleImage(imagePath, alt, width, height);
  if (resolved) {
    return resolved;
  }

  const fallback = await resolveArticleImage('blog/_placeholder.svg', alt, width, height);
  if (fallback) {
    return fallback;
  }

  return {
    src: '/logo-recomecar.png',
    isRemote: false,
    alt,
    width,
    height,
  };
}
