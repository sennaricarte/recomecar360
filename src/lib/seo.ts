const NAMED_ENTITIES: Record<string, string> = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  hellip: '…',
  ndash: '–',
  mdash: '—',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
};

/** Decodifica entidades HTML. Duas passadas cobrem texto duplamente codificado (&amp;nbsp;). */
export function decodeEntities(input: string): string {
  let text = input;
  for (let pass = 0; pass < 2; pass += 1) {
    text = text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
      if (entity[0] === '#') {
        const code =
          entity[1].toLowerCase() === 'x'
            ? Number.parseInt(entity.slice(2), 16)
            : Number.parseInt(entity.slice(1), 10);
        return Number.isFinite(code) && code > 0 && code <= 0x10ffff
          ? String.fromCodePoint(code)
          : match;
      }
      return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
    });
  }
  return text;
}

/** Converte HTML/markdown em texto corrido, sem tags, entidades ou espaços repetidos. */
export function toPlainText(input: string): string {
  const stripped = input
    .replace(/<(script|style|figure|iframe)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    // Tags inline (negrito, link...) somem sem deixar espaço; as demais separam palavras.
    .replace(/<\/?(strong|em|b|i|u|a|span|mark|small|sup|sub)(\s[^>]*)?>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\[\/?[a-z_-]+[^\]]*\]/gi, ' ');

  return decodeEntities(stripped)
    .replace(/[*_`]+/g, '')
    .replace(/ /g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
}

/** Corta em fim de frase (preferencial) ou em palavra inteira, nunca no meio de uma palavra. */
export function truncateAtBoundary(text: string, max = 155): string {
  if (text.length <= max) {
    return text;
  }

  const slice = text.slice(0, max + 1);
  const sentenceEnd = Math.max(
    slice.lastIndexOf('. '),
    slice.lastIndexOf('! '),
    slice.lastIndexOf('? '),
  );

  if (sentenceEnd >= 90) {
    return slice.slice(0, sentenceEnd + 1);
  }

  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : text.slice(0, max);
  return `${cut.replace(/[\s,;:–—-]+$/u, '')}…`;
}

/** Description pronta para <meta>: texto limpo e com no máximo `max` caracteres. */
export function normalizeDescription(input: string, max = 155): string {
  return truncateAtBoundary(toPlainText(input), max);
}

const SKIPPED_BLOCK_START = /^(leia também|veja também|leia mais|fonte:|crédito|foto:)/i;

/**
 * Extrai o começo do texto real de um artigo (sem títulos, legendas ou "Leia também")
 * para servir de description quando o artigo não tem metaDescription nem excerpt.
 */
export function leadTextFromBody(body: string, minLength = 110): string {
  const withoutHeadings = body
    .replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, '\n')
    .replace(/^#{1,6}\s.*$/gm, '\n');

  const blocks = withoutHeadings
    .split(/\n\s*\n|<\/p>|<\/li>|<\/blockquote>|\n/i)
    .map((block) => toPlainText(block))
    .filter((block) => block.length >= 40 && !SKIPPED_BLOCK_START.test(block));

  let lead = '';
  for (const block of blocks.slice(0, 3)) {
    lead = lead ? `${lead} ${block}` : block;
    if (lead.length >= minLength) {
      break;
    }
  }
  return lead;
}
