import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: './',
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-pagesfix-[hash].js',
        chunkFileNames: 'assets/[name]-pagesfix-[hash].js',
        assetFileNames: 'assets/[name]-pagesfix-[hash][extname]'
      }
    }
  }
})
