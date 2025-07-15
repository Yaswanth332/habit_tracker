import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['mysql2/promise', 'mysql2']
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react', 'mysql2/promise', 'mysql2'],
  },
});
