import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core libraries - changes rarely
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Firebase - large library, separate chunk
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // UI libraries - animation and icons
          'ui-vendor': ['framer-motion', 'lucide-react', 'react-hot-toast'],
        },
      },
    },
    // Increase warning limit since we're using code splitting
    chunkSizeWarningLimit: 600,
  },
})
