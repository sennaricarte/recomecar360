// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync } from 'node:fs';

// Artigos com `noindex: true` no frontmatter ficam fora do sitemap.
const noindexPaths = new Set(
  readdirSync('./src/content/articles')
    .filter((file) => file.endsWith('.md'))
    .map((file) => readFileSync(`./src/content/articles/${file}`, 'utf8'))
    .filter((text) => /^noindex:\s*true\s*$/m.test(text.split(/\r?\n---\r?\n/)[0]))
    .map((text) => text.match(/^slug:\s*"?([^"\n]+)"?\s*$/m)?.[1])
    .filter(Boolean)
    .map((slug) => `/blog/${slug}`),
);

// https://astro.build/config
export default defineConfig({
  site: 'https://recomecar360.org',
  output: 'static',
  image: {
    domains: ['images.unsplash.com', 'mapaosc.ipea.gov.br'],
  },
  markdown: {
    syntaxHighlight: false,
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '') || '/';

        if (path === '/obrigado' || path === '/faca-a-diferenca') {
          return false;
        }

        if (noindexPaths.has(path)) {
          return false;
        }

        // Paginação do blog além da primeira página
        if (/^\/blog\/\d+$/.test(path)) {
          return false;
        }

        // Paginação das categorias do blog além da primeira página
        if (/^\/blog\/categoria\/[^/]+\/\d+$/.test(path)) {
          return false;
        }

        return true;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
