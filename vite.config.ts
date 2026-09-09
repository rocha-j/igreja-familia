import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// GitHub Pages serves project sites from https://<user>.github.io/<repo>/,
// so assets must be requested relative to that subpath, not the domain root.
export default defineConfig({
  base: '/igreja-familia/',
  plugins: [react()],
})
