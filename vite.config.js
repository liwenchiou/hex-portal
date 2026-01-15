import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// 取得您的 GitHub 倉庫名稱
// 假設您的倉庫 URL 是：https://github.com/USERNAME/REPO_NAME
const REPO_NAME = 'hex-portal';

// https://vite.dev/config/
export default defineConfig({
  // 將 base 設置為您的倉庫名稱 (需要以斜線結尾或只用斜線)
  // 這確保了所有資源的路徑都是相對於 gh-pages 子目錄。
  base: `/${REPO_NAME}/`, 
  plugins: [react(),tailwindcss()],
  
})
