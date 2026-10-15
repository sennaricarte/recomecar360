import { getCollection, type CollectionEntry } from 'astro:content';
import { leadTextFromBody, toPlainText, truncateAtBoundary } from './seo';

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

const SEO_TITLE_SUFFIX = ' | Instituto Recomeçar';
const SEO_TITLE_MAX = 60;
const SEO_DESCRIPTION_MIN = 70;

export function getArticleSeoTitle(article: ArticleEntry): string {
  const title = toPlainText(article.data.metaTitle) || toPlainText(article.data.title);
  const withBrand = `${title}${SEO_TITLE_SUFFIX}`;
  // A marca só entra quando o title continua cabendo na SERP (~60 caracteres).
  return withBrand.length <= SEO_TITLE_MAX ? withBrand : title;
}

export function getArticleSeoDescription(article: ArticleEntry): string {
  const title = toPlainText(article.data.title).toLowerCase();

  // 1) Texto escrito para SEO ou resumo do artigo, quando existir e for informativo.
  for (const candidate of [article.data.metaDescription, article.data.excerpt]) {
    const text = toPlainText(candidate);
    if (text.length >= SEO_DESCRIPTION_MIN && text.toLowerCase() !== title) {
      return truncateAtBoundary(text);
    }
  }

  // 2) Sem meta nem resumo: usa o começo do texto real do artigo.
  const lead = leadTextFromBody(article.body ?? '');
  if (lead.length >= SEO_DESCRIPTION_MIN) {
    return truncateAtBoundary(lead);
  }

  // 3) Último recurso: o título.
  return toPlainText(article.data.title);
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
