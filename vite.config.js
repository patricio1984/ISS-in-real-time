// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://api.open-notify.org/iss-now.json',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [react()],
});