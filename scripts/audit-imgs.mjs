import fs from 'node:fs';
import path from 'node:path';

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

let total = 0;
let noAlt = 0;
let emptyAlt = 0;
let hasAltText = 0;
let noWH = 0;
const noWHSamples = [];

for (const file of walk('dist')) {
  const html = fs.readFileSync(file, 'utf8');
  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    total += 1;
    const attrs = match[1];

    if (!/\balt\b/i.test(attrs)) {
      noAlt += 1;
    } else {
      const textMatch = attrs.match(/\balt=(["'])(.*?)\1/i);
      if (!textMatch || textMatch[2] === '') emptyAlt += 1;
      else hasAltText += 1;
    }

    if (!/\bwidth=/i.test(attrs) || !/\bheight=/i.test(attrs)) {
      noWH += 1;
      if (noWHSamples.length < 5) {
        noWHSamples.push({
          file: file.replaceAll('\\', '/'),
          tag: match[0].slice(0, 140),
        });
      }
    }
  }
}

console.log(
  JSON.stringify(
    {
      total,
      noAlt,
      emptyAlt,
      hasAltText,
      noWH,
      noWHSamples,
    },
    null,
    2,
  ),
);
