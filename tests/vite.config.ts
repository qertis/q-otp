import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  root: new URL('.', import.meta.url).pathname,
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "quasar/src/css/variables.sass" as *;\n',
      },
    },
  },
  server: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
  },
})
