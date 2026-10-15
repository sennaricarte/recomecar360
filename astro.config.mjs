// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

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
