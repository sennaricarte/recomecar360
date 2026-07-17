import { getCollection, type CollectionEntry } from 'astro:content';

export type ArticleEntry = CollectionEntry<'articles'>;

const articleDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export async function getPublishedArticles(): Promise<ArticleEntry[]> {
  const articles = await getCollection('articles', ({ data }) => data.status === 'published');
  return articles.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export function formatArticleDate(date: Date): string {
  return articleDateFormatter.format(date);
}

export function getArticleSeoTitle(article: ArticleEntry): string {
  const title = article.data.metaTitle.trim() || article.data.title;
  return `${title} | Instituto Recomeçar`;
}

export function getArticleSeoDescription(article: ArticleEntry): string {
  return article.data.metaDescription.trim() || article.data.excerpt.trim() || article.data.title;
}

export function getReadingTimeMinutes(body: string): number {
  const text = body
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = text ? text.split(' ').length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function getRelatedArticles(
  article: ArticleEntry,
  allArticles: ArticleEntry[],
  limit = 3,
): ArticleEntry[] {
  return allArticles
    .filter(
      (entry) =>
        entry.data.category === article.data.category &&
        entry.data.slug !== article.data.slug,
    )
    .slice(0, limit);
}
