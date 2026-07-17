import fs from 'node:fs';

const pages = [
  'dist/index.html',
  'dist/blog/dicas-entrevista-emprego-pat/index.html',
  'dist/relatorio-de-atividades/index.html',
  'dist/quem-somos/index.html',
  'dist/contato/index.html',
];

for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    level: Number(m[1]),
    text: m[2].replace(/<[^>]+>/g, '').trim().slice(0, 60),
  }));

  const skips = [];
  let prev = 0;
  for (const heading of headings) {
    if (prev > 0 && heading.level > prev + 1) {
      skips.push(`h${prev} -> h${heading.level} ("${heading.text}")`);
    }
    prev = heading.level;
  }

  console.log(`\n=== ${page} ===`);
  console.log(`headings: ${headings.map((h) => `h${h.level}`).join(', ')}`);
  console.log(skips.length ? `SKIPS: ${skips.join(' | ')}` : 'OK: no skipped levels');
}
