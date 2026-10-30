import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/ipo': {
        target: 'https://ipobackend.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      '/api/contact': {
        target: 'https://ipobackend.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      '/ipo/contact': {
        target: 'https://ipobackend.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/ipo\/contact/, '/api/contact'),
      },
    },
  },
});
