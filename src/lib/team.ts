import type { CollectionEntry } from 'astro:content';

export type ConselhoEntry = CollectionEntry<'conselho'>;
export type DiretoriaEntry = CollectionEntry<'diretoria'>;
export type EmbaixadorEntry = CollectionEntry<'embaixadores'>;
export type ColunistaEntry = CollectionEntry<'colunistas'>;

export type TeamMemberEntry = ConselhoEntry | DiretoriaEntry | EmbaixadorEntry;

export function sortByOrder<T extends { data: { order: number } }>(members: T[]): T[] {
  return [...members].sort((a, b) => a.data.order - b.data.order);
}

export function formatRole(member: TeamMemberEntry): string {
  const role = 'role' in member.data && member.data.role ? member.data.role : '';
  const company =
    'company' in member.data && member.data.company?.trim() ? member.data.company.trim() : '';

  if (role && company) {
    return `${role} (${company})`;
  }

  return role;
}

export function getLinkedIn(member: TeamMemberEntry): string | undefined {
  return 'linkedin' in member.data ? member.data.linkedin : undefined;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return '?';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
