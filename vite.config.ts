import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd());

  // Validate required environment variables
  if (!env.VITE_UPSTREAM_API_URL) {
    throw new Error(
      'VITE_UPSTREAM_API_URL is required in environment variables',
    );
  }

  return {
    base: '/ui/',
    resolve: {
      alias: {
        src: '/src',
      },
    },
    plugins: [react()],
  };
});
