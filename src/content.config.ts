import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string(),
    category: z.enum(['Blog - Recomeçar 360', 'Guest Post']),
    image: z.string(),
    pubDate: z.coerce.date(),
    /** Data da última revisão real do artigo. Vira dateModified no schema; sem ela, o campo é omitido. */
    updatedDate: z.coerce.date().optional(),
    status: z.enum(['published', 'draft']).default('published'),
    metaTitle: z.string(),
    metaDescription: z.string(),
    focusKeyword: z.string().optional(),
  }),
});

const conselho = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/conselho' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      photo: image(),
      order: z.number(),
      bio: z.string().optional(),
      company: z.string().optional(),
      linkedin: z.string().url().optional(),
    }),
});

const diretoria = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/diretoria' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      photo: image(),
      order: z.number(),
      bio: z.string().optional(),
      company: z.string().optional(),
      linkedin: z.string().url().optional(),
    }),
});

const embaixadores = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/embaixadores' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string().optional(),
      photo: image(),
      order: z.number(),
      bio: z.string().optional(),
      linkedin: z.string().url().optional(),
    }),
});

const colunistas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/colunistas' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      columnName: z.string(),
      photo: image().optional(),
      bio: z.string(),
      slug: z.string(),
      order: z.number().optional(),
    }),
});

export const collections = {
  articles,
  conselho,
  diretoria,
  embaixadores,
  colunistas,
};
