import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Link previews need absolute URLs. On Vercel, VERCEL_PROJECT_PRODUCTION_URL holds the
// production domain at build time; SITE_URL overrides it (e.g. a custom domain).
// Locally neither is set, so URLs stay relative.
const siteUrl = (process.env.SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
).replace(/\/$/, '');

const shareUrls = {
  name: 'share-urls',
  transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
};

export default defineConfig({
  plugins: [react(), shareUrls],
  server: {
    port: 5180,
    proxy: { '/api': 'http://localhost:5050' },
  },
});
