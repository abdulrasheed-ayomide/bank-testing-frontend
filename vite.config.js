import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Every backend call goes through src/services/api.js with
      // baseURL '/api/v1' in dev (see .env.example). Since every real
      // request already starts with /api, a single proxy rule covers
      // auth, accounts, transactions, notifications, profile, and admin —
      // there is no need for one rule per resource.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
