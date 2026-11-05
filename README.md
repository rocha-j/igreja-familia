# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Deploy

The site is built with Vite and published in two places from the same code.

- **GitHub Pages** (default): the workflow in `.github/workflows/deploy.yml` publishes `main` under `/igreja-familia/`.
- **Cloudflare Pages**: connect this repository in the Cloudflare dashboard (Workers & Pages > Create > Pages > Connect to Git) with
  - Build command: `npm run build`
  - Build output directory: `dist`
  - Environment variables: `SITE_BASE=/` and `NODE_VERSION=20`

  The production branch is `main`; every other branch (such as `IgrejaFamili-V2`) gets its own preview URL. `public/_redirects` makes
  routes like `/doacoes` and `/m` fall back to the app. `SITE_BASE` sets the base path and `SITE_ORIGIN` (optional) the absolute
  origin used in the canonical/alternate links; Cloudflare's own `CF_PAGES_URL` is used when `SITE_ORIGIN` is not set.

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
