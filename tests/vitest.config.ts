import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "quasar/src/css/variables.sass" as *;\n',
      },
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
})
