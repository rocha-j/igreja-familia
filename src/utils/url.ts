// Prefixes a root-relative path (e.g. "/#hero", "/doacoes") with Vite's
// configured base path, so links resolve correctly whether the site is
// served from the domain root (local dev) or a subpath (GitHub Pages
// project sites live at https://<user>.github.io/<repo>/).
export function withBase(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}
