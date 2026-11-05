# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Deploy

The site is built with Vite and published in two places from the same code.

- **GitHub Pages** (default): the workflow in `.github/workflows/deploy.yml` publishes `main` under `/igreja-familia/`.
- **Cloudflare** (Workers with static assets, `wrangler.jsonc`): connect this repository in the Cloudflare dashboard
  (Workers & Pages > Create > Connect to Git). Build command `npm run build`, deploy command `npx wrangler deploy`.
  No environment variables are needed: Cloudflare's build sets `WORKERS_CI`, which makes `vite.config.ts` serve the site from the
  domain root. The Worker falls back to `index.html` for routes such as `/doacoes`, and `/m/` is a real file emitted by the build.
  Set `SITE_ORIGIN` (for example `https://igreja-familia.<account>.workers.dev`) to add canonical/alternate links to that build;
  without it they are left out. `SITE_BASE` overrides the base path on any host.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
