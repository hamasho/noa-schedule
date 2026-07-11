import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves the site under /noa-schedule/, but the dev server
  // should live at the root so `http://localhost:5173` (per the README) isn't
  // a blank page. Only the production build needs the subpath base.
  base: command === 'build' ? '/noa-schedule/' : '/',
  plugins: [react(), tailwindcss()],
}))
