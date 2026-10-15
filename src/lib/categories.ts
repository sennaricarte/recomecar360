/**
 * O blog tem uma única categoria ("Blog"), então não há páginas de categoria:
 * a listagem completa vive em /blog/ (paginada em /blog/2/, /blog/3/...).
 */
export function getBlogPagePath(page = 1): string {
  if (page <= 1) {
    return '/blog/';
  }

  return `/blog/${page}/`;
}
