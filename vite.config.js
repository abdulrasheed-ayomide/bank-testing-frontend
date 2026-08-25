import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'https://bank-testing-backend.onrender.com',
        changeOrigin: true,
        headers: { origin: 'https://bank-testing-frontend.vercel.app' },
        rewrite: (path) => `/api/v1${path}`,
      },
      '/accounts': {
        target: 'https://bank-testing-backend.onrender.com',
        changeOrigin: true,
        headers: { origin: 'https://bank-testing-frontend.vercel.app' },
        rewrite: (path) => `/api/v1${path}`,
      },
      '/transactions': {
        target: 'https://bank-testing-backend.onrender.com',
        changeOrigin: true,
        headers: { origin: 'https://bank-testing-frontend.vercel.app' },
        rewrite: (path) => `/api/v1${path}`,
      },
      '/notifications': {
        target: 'https://bank-testing-backend.onrender.com',
        changeOrigin: true,
        headers: { origin: 'https://bank-testing-frontend.vercel.app' },
        rewrite: (path) => `/api/v1${path}`,
      },
      '/profile': {
        target: 'https://bank-testing-backend.onrender.com',
        changeOrigin: true,
        headers: { origin: 'https://bank-testing-frontend.vercel.app' },
        rewrite: (path) => `/api/v1${path}`,
      },
      '/admin': {
        target: 'https://bank-testing-backend.onrender.com',
        changeOrigin: true,
        headers: { origin: 'https://bank-testing-frontend.vercel.app' },
        rewrite: (path) => `/api/v1${path}`,
      },
    },
  },
})
