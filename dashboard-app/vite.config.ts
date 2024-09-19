import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // This ensures Vite binds to all network interfaces
    port: 5173,        // Ensure this matches the port you're forwarding
    strictPort: true,  // Prevent Vite from automatically changing the port if it's occupied
  }
})
