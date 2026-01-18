import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const REPO_NAME = 'hex-portal';

export default defineConfig({
  base: `/${REPO_NAME}/`, 
  plugins: [react(), tailwindcss()],
  build: {
    // 確保編譯產物支援 ES2020 (包含 ?. 和 ?? 語法)
    target: 'es2020'
  },
  optimizeDeps: {
    // 強制預構建支援的 ES 版本
    esbuildOptions: {
      target: 'es2020'
    }
  }
})