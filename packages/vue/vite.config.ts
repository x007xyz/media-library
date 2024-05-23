import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': __dirname + '/src', // 设置 '@' 指向 'src' 目录
    }
  },
  plugins: [
    vue()
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'media-library-vue',
      fileName: (format) => `media-library-vue.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
})

