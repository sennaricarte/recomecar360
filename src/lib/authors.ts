export interface AuthorInfo {
  name: string;
  /** Pessoa ou equipe/organização. Define o tipo do autor no schema. */
  type: 'Person' | 'Organization';
  /** Página própria do autor no site. Sem ela, o nome aparece sem link. */
  path?: string;
  /** Bio exibida no artigo. Sem ela, usa a bio do colunista indicado em `colunista`. */
  bio?: string;
  /** Slug em src/content/colunistas, de onde vem a bio quando ela não está aqui. */
  colunista?: string;
  /** Pessoa que trabalha no Instituto Recomeçar (vira worksFor no schema). */
  worksForInstitute?: boolean;
}

/**
 * Autores reconhecidos nos artigos (campo `author` do frontmatter).
 * Para um novo autor: adicione aqui e use o nome exato no artigo.
 */
export const AUTHORS = {
  'Senna Ricarte': {
    name: 'Senna Ricarte',
    type: 'Person',
    path: '/colunistas/senna-ricarte/',
    colunista: 'senna-ricarte',
    worksForInstitute: true,
  },
  'Joel Novaes': {
    name: 'Joel Novaes',
    type: 'Person',
    bio: 'Joel Novaes é jornalista profissional e trabalha no Instituto Recomeçar desde 2020. Atua também em Relações Institucionais.',
    worksForInstitute: true,
  },
  'Equipe de Comunicação Recomeçar': {
    name: 'Equipe de Comunicação Recomeçar',
    type: 'Organization',
  },
} as const satisfies Record<string, AuthorInfo>;

export type AuthorName = keyof typeof AUTHORS;

export const AUTHOR_NAMES = Object.keys(AUTHORS) as [AuthorName, ...AuthorName[]];

export function getAuthor(name: string | undefined): AuthorInfo | undefined {
  return name ? (AUTHORS as Record<string, AuthorInfo>)[name] : undefined;
}
