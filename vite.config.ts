import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = fileURLToPath(new URL('.', import.meta.url))
  // Vite only exposes VITE_* to the client, so read the whole .env here and
  // pass ANSWER_API through as a compile-time constant.
  const env = loadEnv(mode, envDir, '')
  const answerApi = process.env.VITE_ANSWER_API ?? env.VITE_ANSWER_API ?? ''

  return {
    plugins: [vue()],
    define: {
      __ANSWER_API__: JSON.stringify(answerApi),
    },
  }
})
