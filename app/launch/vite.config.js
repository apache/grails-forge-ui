import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [svgr(), react()],
  // Production is served at https://grails.apache.org/start/. Local `vite` keeps `/`.
  base: process.env.VITE_BASE || '/',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@mui/')) {
            return 'mui'
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      // @materializecss/materialize exports only JS in its package.json "exports" field,
      // so we alias direct CSS imports to the actual file paths.
      '@materializecss/materialize/dist/css': path.resolve(
        __dirname,
        'node_modules/@materializecss/materialize/dist/css'
      ),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
