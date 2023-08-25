import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { VitePWA } from 'vite-plugin-pwa'

import manifest from './public/manifest.json'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,json,svg}'],
        globDirectory: 'public',
        swDest: 'sw.js',
        sourcemap: false
      }
    })
  ],

  server: {
    host: true,
    watch: {
      usePolling: true
    }
  }
})
