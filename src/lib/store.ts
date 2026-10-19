/** Loja Opportunità Store (Uma Penca). Links com UTM para medir cliques do site no GA4. */
const STORE_BASE_URL = 'https://umapenca.com/opportunitastore/';

export type StoreLinkPlacement = 'menu' | 'home-card';

export function storeUrl(placement: StoreLinkPlacement): string {
  const url = new URL(STORE_BASE_URL);
  url.searchParams.set('utm_source', 'recomecar360.org');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', 'opportunita-store');
  url.searchParams.set('utm_content', placement);
  return url.href;
}
