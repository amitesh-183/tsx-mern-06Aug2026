import { defineConfig } from 'vite'
import type { TestUserConfig } from 'vitest/node'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// vitest 4.1.10 ships a broken `vitest/config` type entry (a self-referential
// `export * from 'vitest/config'`), so the `test` field is typed here directly.
declare module 'vite' {
  interface UserConfig {
    test?: TestUserConfig
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    css: true,
    restoreMocks: true,
  },
})
