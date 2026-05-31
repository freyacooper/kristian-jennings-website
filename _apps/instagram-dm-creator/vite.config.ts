import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative asset paths so the built app works under any deploy subpath
  // (we serve it from /tools/imessage-screenshot-maker/app/ on the site).
  base: './',
  plugins: [react(), tailwindcss()],
})
