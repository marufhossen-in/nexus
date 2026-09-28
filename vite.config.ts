import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/nexus/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
});
