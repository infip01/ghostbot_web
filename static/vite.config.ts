import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  root: './frontend',
  base: '/app/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend/src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:1218',
        changeOrigin: true,
      },
      '/upload': {
        target: 'http://localhost:1218',
        changeOrigin: true,
      },
      '/download': {
        target: 'http://localhost:1218',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          animations: ['framer-motion'],
          utils: ['axios', 'react-query']
        }
      }
    }
  }
})