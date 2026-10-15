export const SITE_URL = 'https://recomecar360.org';

const SOCIAL_LINKS = [
  'https://www.instagram.com/recomecar360',
  'https://www.linkedin.com/company/instituto-recomecar/?originalSubdomain=br',
  'https://www.facebook.com/recomecargf',
  'https://www.youtube.com/@Recomecar360',
] as const;

export function nonprofitJsonLd(siteUrl: string = SITE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NonprofitOrganization',
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
