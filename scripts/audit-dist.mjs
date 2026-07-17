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

const htmlFiles = walk('dist');
const scripts = { jsonld: 0, adsense: 0, other: [] };
const imgsNoWH = [];
const imgsNoAlt = [];
const blankTargetNoRel = [];
let totalHtmlBytes = 0;

const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
const imgRe = /<img\b([^>]*)>/gi;
const linkRe = /<a\b([^>]*)>/gi;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  totalHtmlBytes += Buffer.byteLength(html);

  let match;
  while ((match = scriptRe.exec(html))) {
    const attrs = match[1];
    const body = match[2];
    if (/type=["']application\/ld\+json["']/.test(attrs)) scripts.jsonld += 1;
    else if (/adsbygoogle|googlesyndication/.test(attrs + body)) scripts.adsense += 1;
    else {
      scripts.other.push({
        file: file.replaceAll('\\', '/'),
        attrs: attrs.slice(0, 160),
        body: body.slice(0, 80),
      });
    }
  }

  while ((match = imgRe.exec(html))) {
    const attrs = match[1];
    if (!/\bwidth=/.test(attrs) || !/\bheight=/.test(attrs)) {
      imgsNoWH.push({ file: file.replaceAll('\\', '/'), tag: match[0].slice(0, 120) });
    }
    if (!/\balt=/.test(attrs)) {
      imgsNoAlt.push({ file: file.replaceAll('\\', '/'), tag: match[0].slice(0, 120) });
    }
  }

  while ((match = linkRe.exec(html))) {
    const attrs = match[1];
    if (/target=["']_blank["']/.test(attrs) && !/rel=["'][^"']*noopener/.test(attrs)) {
      blankTargetNoRel.push({
        file: file.replaceAll('\\', '/'),
        tag: match[0].slice(0, 160),
      });
    }
  }
}

function getDirSize(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) total += getDirSize(full);
    else total += fs.statSync(full).size;
  }
  return total;
}

const distBytes = getDirSize('dist');

console.log(
  JSON.stringify(
    {
      htmlFiles: htmlFiles.length,
      scripts,
      imgsNoWH: imgsNoWH.length,
      imgsNoWHSamples: imgsNoWH.slice(0, 5),
      imgsNoAlt: imgsNoAlt.length,
      imgsNoAltSamples: imgsNoAlt.slice(0, 5),
      blankTargetNoRel: blankTargetNoRel.length,
      blankTargetSamples: blankTargetNoRel.slice(0, 5),
      totalHtmlBytes,
      avgHtmlBytes: Math.round(totalHtmlBytes / htmlFiles.length),
      distBytes,
      distMB: (distBytes / (1024 * 1024)).toFixed(1),
    },
    null,
    2,
  ),
);
