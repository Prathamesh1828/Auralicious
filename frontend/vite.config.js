import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // ← allows connections from other devices
    port: 5173,       // ← or any other port you like
  },
  plugins: [react()],
})
