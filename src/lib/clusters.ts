/**
 * Clusters temáticos do blog. Cada artigo pode declarar `cluster` no frontmatter.
 * `pillar` é o slug do guia principal do tema; sem ele, o cluster não tem pilar ainda.
 */
export const CLUSTERS = {
  egressos: {
    label: 'Egressos e reinserção social',
    pillar: 'egressos-do-sistema-prisional-entenda-quem-sao',
  },
  'sistema-prisional': {
    label: 'Sistema prisional',
    pillar: 'sistema-prisional-brasileiro-guia-direitos-e-reinsercao',
  },
  profissoes: {
    label: 'Profissões e primeiro emprego',
    pillar: 'profissoes-para-comecar-sem-experiencia',
  },
  'emprego-e-cursos': {
    label: 'Emprego, cursos e qualificação',
    pillar: 'como-conseguir-emprego-e-se-qualificar-de-graca',
  },
  beneficios: {
    label: 'Benefícios e direitos',
    pillar: 'o-que-sao-beneficios-sociais',
  },
  'cultura-periferica': {
    label: 'Cultura periférica',
    pillar: 'o-que-e-cultura-periferica',
  },
  'terceiro-setor': {
    label: 'Terceiro setor e impacto social',
    pillar: 'estrategias-para-captacao-de-recursos-para-o-terceiro-setor',
  },
  institucional: {
    label: 'Notícias e histórias do Recomeçar',
    pillar: 'resultados-do-instituto-recomecar-relatorio-de-atividades',
  },
} as const satisfies Record<string, { label: string; pillar?: string }>;

export type ClusterId = keyof typeof CLUSTERS;

export const CLUSTER_IDS = Object.keys(CLUSTERS) as [ClusterId, ...ClusterId[]];

export function getCluster(id: string | undefined): { id: ClusterId; label: string; pillar?: string } | undefined {
  if (!id || !(id in CLUSTERS)) return undefined;
  const cluster = CLUSTERS[id as ClusterId] as { label: string; pillar?: string };
  return { id: id as ClusterId, ...cluster };
}
