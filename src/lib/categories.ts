export const ARTICLE_CATEGORIES = [
  {
    value: 'Blog - Recomeçar 360',
    slug: 'blog-recomecar-360',
    label: 'Blog',
  },
  {
    value: 'Guest Post',
    slug: 'guest-post',
    label: 'Blog',
  },
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number]['value'];
export type ArticleCategorySlug = (typeof ARTICLE_CATEGORIES)[number]['slug'];

const categoryByValue = new Map(ARTICLE_CATEGORIES.map((category) => [category.value, category]));
const categoryBySlug = new Map(ARTICLE_CATEGORIES.map((category) => [category.slug, category]));

export function categoryToSlug(category: ArticleCategory): ArticleCategorySlug {
  return categoryByValue.get(category)?.slug ?? 'blog-recomecar-360';
}

export function slugToCategory(slug: string): ArticleCategory | undefined {
  return categoryBySlug.get(slug as ArticleCategorySlug)?.value;
}

export function getCategoryLabel(slug: ArticleCategorySlug): string {
  return categoryBySlug.get(slug)?.label ?? slug;
}

export function getCategoryPagePath(slug: ArticleCategorySlug, page = 1): string {
  if (page <= 1) {
    return `/blog/categoria/${slug}/`;
  }

  return `/blog/categoria/${slug}/${page}/`;
}

export function getBlogPagePath(page = 1): string {
  if (page <= 1) {
    return '/blog/';
  }

  return `/blog/${page}/`;
}
