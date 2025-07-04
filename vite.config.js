import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://crudpractice.test/', // Laravel backend
        changeOrigin: true,
        secure: false,
      },
      '/storage': {
        target: 'http://crudpractice.test/', // Ensure public/storage is linked
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
