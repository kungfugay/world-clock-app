import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/world-clock-app/', // GitHub 저장소 이름으로 변경
  build: {
    outDir: 'dist'
  }
})