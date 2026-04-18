import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Whenever your frontend asks for /api/v2/execute, 
      // Vite will secretly forward it to Piston on port 2000
      '/api': {
        target: 'http://80.225.224.163:2000',
        changeOrigin: true,
      }
    }
  }
})
