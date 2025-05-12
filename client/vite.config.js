import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    sourcemap: false,
    // Simplify the build process
    chunkSizeWarningLimit: 1600,
  },
  // Fix for potential caching issues
  server: {
    port: 3000,
    strictPort: true,
    host: true
  }
})
