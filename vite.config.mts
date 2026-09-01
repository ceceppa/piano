/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    // tone's compiled ESM output uses extensionless relative imports, which
    // only resolve through Vite's bundler-style resolution, not Vitest's
    // default externalized Node-ESM loader for this dependency.
    server: {
      deps: {
        inline: ['tone', '@tonejs/piano'],
      },
    },
  },
})