/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        text: 'var(--color-text)',
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        accent: 'var(--color-accent)',
        'accent-text': 'var(--color-accent-text)',
        border: 'var(--color-border)',
        muted: 'var(--color-muted)',
        'muted-text': 'var(--color-muted-text)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
      },
      fontFamily: {
        body: 'var(--font-body)',
      },
      maxWidth: {
        container: 'var(--container-max)',
      },
    },
  },
  plugins: [],
};
