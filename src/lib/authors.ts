/**
 * Autores reconhecidos nos artigos (campo `author` do frontmatter).
 * `path` é opcional: só autores com página própria no site têm link.
 */
export const AUTHORS = {
  'Senna Ricarte': { name: 'Senna Ricarte', path: '/colunistas/senna-ricarte/' },
  'Joel Novaes': { name: 'Joel Novaes' },
} as const;

export type AuthorName = keyof typeof AUTHORS;

export const AUTHOR_NAMES = Object.keys(AUTHORS) as [AuthorName, ...AuthorName[]];

export interface AuthorInfo {
  name: string;
  path?: string;
}

export function getAuthor(name: string | undefined): AuthorInfo | undefined {
  return name ? (AUTHORS as Record<string, AuthorInfo>)[name] : undefined;
}
