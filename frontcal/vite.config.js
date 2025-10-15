import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 👇 Esto arregla el problema global con animejs
      animejs: 'animejs/lib/anime.es.js',
    },
  },
})
