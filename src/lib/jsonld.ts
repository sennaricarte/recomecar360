export const SITE_URL = 'https://recomecar360.org';

const SOCIAL_LINKS = [
  'https://www.instagram.com/recomecar360',
  'https://www.linkedin.com/company/instituto-recomecar/?originalSubdomain=br',
  'https://www.facebook.com/recomecargf',
  'https://www.youtube.com/@Recomecar360',
] as const;

export interface BreadcrumbInput {
  label: string;
  /** Caminho relativo ou URL. Sem href, o item aponta para a própria página. */
  href?: string;
  current?: boolean;
}

/**
 * BreadcrumbList a partir dos mesmos itens do breadcrumb visual.
 * "Início" é adicionado automaticamente quando a trilha não começa por ele.
 */
export function breadcrumbJsonLd(
  items: BreadcrumbInput[],
  currentPath: string,
  siteUrl: string = SITE_URL,
) {
  const trail: BreadcrumbInput[] =
    items[0]?.href === '/' ? items : [{ label: 'Início', href: '/' }, ...items];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: new URL(item.href ?? currentPath, siteUrl).href,
    })),
  };
}

/** Organização como autora/publicadora de conteúdo, ligada à entidade da home por @id. */
export function organizationRef(siteUrl: string = SITE_URL) {
  return {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'Instituto Recomeçar',
    url: siteUrl,
  };
}

export function profilePageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  siteUrl?: string;
}) {
  const siteUrl = input.siteUrl ?? SITE_URL;
  const url = new URL(input.path, siteUrl).href;

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url,
    name: input.name,
    inLanguage: 'pt-BR',
    mainEntity: {
      '@type': 'Person',
      name: input.name,
      description: input.description,
      url,
    },
  };
}

export function nonprofitJsonLd(siteUrl: string = SITE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NonprofitOrganization',
    '@id': `${siteUrl}/#organization`,
    name: 'Instituto Recomeçar',
    url: siteUrl,
    description:
      'O Instituto Recomeçar reduz a reincidência criminal e gera segurança pública com ROI comprovado: R$16 para cada R$1 investido.',
    logo: `${siteUrl}/logo-recomecar.png`,
    foundingDate: '2015',
    sameAs: [...SOCIAL_LINKS],
  };
}

export function websiteJsonLd(siteUrl: string = SITE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Instituto Recomeçar',
    url: siteUrl,
    inLanguage: 'pt-BR',
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqPageJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
