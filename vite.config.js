import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.laxo.one',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true
      }
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  }
})
