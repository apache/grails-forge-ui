import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig({
  plugins: [svgr(), react()],
  base: './',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
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
  define: {
    // Support CRA-style env variable access
    'process.env': {},
  },
})
