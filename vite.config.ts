import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// Cloudflare's build systems set these variables (Workers Builds: WORKERS_CI,
// Pages: CF_PAGES), so the same repository builds correctly in both places.
const ON_CLOUDFLARE = Boolean(process.env.WORKERS_CI || process.env.CF_PAGES)
// Where the site is served from. GitHub Pages hosts it under a repo subpath
// (the default); Cloudflare serves it from the domain root. SITE_BASE overrides both.
const BASE = (process.env.SITE_BASE ?? (ON_CLOUDFLARE ? '/' : '/igreja-familia/')).replace(/^\/?/, '/').replace(/\/?$/, '/')
// Public origin of the deployed site, used for absolute canonical/alternate URLs.
// Left empty on Cloudflare unless SITE_ORIGIN (or Pages' CF_PAGES_URL) says otherwise:
// then those links are omitted rather than pointing at the GitHub Pages copy.
const ORIGIN = (process.env.SITE_ORIGIN ?? process.env.CF_PAGES_URL ?? (ON_CLOUDFLARE ? '' : 'https://rocha-j.github.io')).replace(/\/$/, '')
const DESKTOP_URL = `${ORIGIN}${BASE}`
const MOBILE_URL = `${ORIGIN}${BASE}m/`
const PHONE_MEDIA = 'only screen and (max-width: 640px)'

/**
 * GitHub Pages has no server rewrites, and its 404.html trick answers with a
 * 404 status that search engines do not index. So the build emits a real
 * `m/index.html` (same app shell, same assets) and wires the two URLs the way
 * Google documents for separate mobile URLs: desktop declares the mobile page
 * as `alternate`, mobile points `canonical` back at desktop.
 */
function mobileEntry(): Plugin {
  const marker = '<!--page-links-->'
  return {
    name: 'igreja-familia-mobile-entry',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html.replace(marker, !ORIGIN ? '' : `<link rel="canonical" href="${DESKTOP_URL}" />\n    <link rel="alternate" media="${PHONE_MEDIA}" href="${MOBILE_URL}" />`),
    },
    generateBundle: {
      // After Vite's own HTML plugin has emitted index.html into the bundle.
      order: 'post',
      handler(_options, bundle) {
        const page = bundle['index.html']
        if (page?.type !== 'asset') return
        const mobile = String(page.source)
          .replace(/\s*<link rel="alternate"[^>]*>/, '')
          .replace(/<title>[^<]*<\/title>/, '<title>Igreja Família — versão para celular</title>')
        this.emitFile({ type: 'asset', fileName: 'm/index.html', source: mobile })
      },
    },
  }
}

// https://vite.dev/config/
// GitHub Pages serves project sites from https://<user>.github.io/<repo>/,
// so assets must be requested relative to that subpath, not the domain root.
export default defineConfig({
  base: BASE,
  plugins: [react(), mobileEntry()],
})
